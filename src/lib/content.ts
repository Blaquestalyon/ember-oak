/**
 * Content resolution + cache (blueprint §6).
 *
 * - In-memory cache, TTL CONTENT_CACHE_TTL_SECONDS (default 60), stale-while-revalidate 600s.
 * - Single-flight: only one Airtable request in flight; concurrent renders share it.
 * - Per-field resolution: live value if valid → last good cached value → committed default.
 * - On 401/403: stop retrying (one attempt per TTL window), keep serving fallback.
 */
import {
  CONTENT_DEFAULTS,
  KNOWN_KEYS,
  ROAST_DEFAULTS,
  type Roast,
  type RoastLevel,
  type RoastProcess,
  type ImageSlug,
} from '../content/fallback';
import { readSnapshot, AirtableAuthError, type RoastRecord } from './airtable';
import { checkContentField, isKnownKey } from './validate';
import { mediaStatus } from './media';
import { env } from './env';

export type ContentSource = 'airtable' | 'cache' | 'fallback';

export interface VisibleRoast {
  name: string;
  roastLevel: RoastLevel;
  origin: string;
  tastingNotes: string;
  process: RoastProcess | null;
  altitude: string | null;
  batchSize: string | null;
  imageSlug: ImageSlug;
  imageAlt: string;
}

export interface ResolvedState {
  /** Every known key, resolved per §6. */
  content: Record<string, string>;
  /** Cards to render: validated, sorted, truncated, capped at 4. */
  roasts: VisibleRoast[];
  /** Published rows in the sheet (before hiding rules), for "2 of 3". */
  publishedCount: number;
  /** Total roast rows in the sheet. */
  totalRoastRows: number;
  source: ContentSource;
  keyRejected: boolean;
  /** ISO time of the last successful Airtable read, or null. */
  lastFetchedAt: string | null;
  /** ISO time of the last attempt (success or failure), or null. */
  lastCheckedAt: string | null;
  /** Seconds since the last successful read, or null. */
  cacheAgeSeconds: number | null;
  /** Owner-facing §6 warnings, in plain English. */
  warnings: string[];
}

interface CacheState {
  lastGoodValues: Map<string, string>;
  lastGoodRoasts: Roast[] | null;
  totalRoastRows: number;
  publishedCount: number;
  fieldWarnings: string[];
  roastRowWarnings: string[];
  lastSuccessAt: number | null;
  lastAttemptAt: number | null;
  /** Set only when a refresh has COMPLETED and failed — never at attempt start,
   *  so an in-flight stale-while-revalidate refresh is not reported as a
   *  failure (the /health "degraded on first poll after idle" bug). */
  lastFailureAt: number | null;
  keyRejected: boolean;
  /** A new attempt may start only after this time (one attempt per TTL window). */
  nextAttemptAt: number;
  inflight: Promise<void> | null;
}

const state: CacheState = {
  lastGoodValues: new Map(),
  lastGoodRoasts: null,
  totalRoastRows: 0,
  publishedCount: 0,
  fieldWarnings: [],
  roastRowWarnings: [],
  lastSuccessAt: null,
  lastAttemptAt: null,
  lastFailureAt: null,
  keyRejected: false,
  nextAttemptAt: 0,
  inflight: null,
};

const LEVELS: RoastLevel[] = ['Light', 'Medium', 'Dark'];
const PROCESSES: RoastProcess[] = ['Washed', 'Natural', 'Honey', 'Wet-hulled', 'Anaerobic'];
const SLUGS: ImageSlug[] = ['roast-light', 'roast-dark'];

function parseRoastRow(record: RoastRecord): Roast | null {
  const f = record.fields;
  const name = f.Name?.trim();
  const level = f['Roast Level'];
  const origin = f.Origin?.trim();
  const notes = f['Tasting Notes'];
  const slug = f['Image Slug']?.trim();
  const alt = f['Image Alt']?.trim();
  if (!name || !origin || !notes || !slug || !alt) return null;
  if (!LEVELS.includes(level as RoastLevel)) return null;
  return {
    name,
    roastLevel: level as RoastLevel,
    origin,
    tastingNotes: notes,
    process: PROCESSES.includes(f.Process as RoastProcess) ? (f.Process as RoastProcess) : null,
    altitude: f.Altitude?.trim() || null,
    batchSize: f['Batch Size']?.trim() || null,
    // Slug validity (against SLUGS and disk) is enforced at render time so the
    // §6 hidden-card warning can name the row.
    imageSlug: slug as ImageSlug,
    imageAlt: alt,
    sortOrder: typeof f['Sort Order'] === 'number' ? f['Sort Order'] : Number.MAX_SAFE_INTEGER,
    published: f.Published === true,
  };
}

async function refresh(): Promise<void> {
  const now = Date.now();
  state.lastAttemptAt = now;
  state.nextAttemptAt = now + env.cacheTtlSeconds * 1000;
  try {
    const snapshot = await readSnapshot();
    const warnings: string[] = [];
    for (const record of snapshot.content) {
      const key = record.fields.Key?.trim() ?? '';
      // Unknown keys are silently ignored — the owner can keep private notes as rows (§6).
      if (!isKnownKey(key)) continue;
      const value = record.fields.Value ?? '';
      const check = checkContentField(key, value);
      if (check.ok) {
        state.lastGoodValues.set(key, value.trim());
        if (check.warning) warnings.push(check.warning); // advisory (still used)
      } else if (check.warning) {
        warnings.push(check.warning);
      }
    }

    const rows = snapshot.roasts.map(parseRoastRow).filter((r): r is Roast => r !== null);
    state.lastGoodRoasts = rows;
    state.totalRoastRows = snapshot.roasts.length;
    state.publishedCount = rows.filter((r) => r.published).length;
    state.fieldWarnings = warnings;
    state.lastSuccessAt = Date.now();
    state.keyRejected = false;
  } catch (err) {
    // A failure is recorded only here, on COMPLETION of a failed refresh —
    // an in-flight refresh must never make a healthy system read "degraded".
    state.lastFailureAt = Date.now();
    if (err instanceof AirtableAuthError) {
      state.keyRejected = true;
    }
    // Keep serving the last good copy (or built-in). Never surface upstream bodies.
    console.error(
      `[content] refresh failed: ${err instanceof Error ? err.message : 'unknown error'}`
    );
  }
}

/** Kick a refresh if the TTL window allows one. Returns the shared in-flight promise. */
function ensureRefresh(): Promise<void> | null {
  if (state.inflight) return state.inflight;
  if (Date.now() < state.nextAttemptAt) return null;
  if (!env.airtableApiKey || !env.airtableBaseId) return null;
  const run = refresh().finally(() => {
    state.inflight = null;
  });
  state.inflight = run;
  return run;
}

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return `${(lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

function buildResolved(): ResolvedState {
  const media = mediaStatus();
  const content: Record<string, string> = {};
  for (const key of KNOWN_KEYS) {
    content[key] = state.lastGoodValues.get(key) ?? CONTENT_DEFAULTS[key]!.value;
  }

  const warnings: string[] = [...state.fieldWarnings];
  const sourceRows =
    state.lastSuccessAt !== null ? (state.lastGoodRoasts ?? []) : ROAST_DEFAULTS;
  const totalRows = state.lastSuccessAt !== null ? state.totalRoastRows : ROAST_DEFAULTS.length;
  const publishedRows = sourceRows.filter((r) => r.published);

  const visible: VisibleRoast[] = [];
  for (const row of [...publishedRows].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'en')
  )) {
    const slugKnown = SLUGS.includes(row.imageSlug);
    const setAvailable =
      row.imageSlug === 'roast-light'
        ? media.available.roastLight
        : row.imageSlug === 'roast-dark'
          ? media.available.roastDark
          : false;
    if (!slugKnown || !setAvailable) {
      warnings.push(
        `'${row.name}' is hidden — its picture (${row.imageSlug}) isn't in the site's files.`
      );
      continue;
    }
    let notes = row.tastingNotes;
    if (notes.length > 60) {
      notes = truncateAtWord(notes, 60);
      warnings.push(
        `'${row.name}' has tasting notes over 60 characters — the card shows a shortened version.`
      );
    }
    visible.push({
      name: row.name,
      roastLevel: row.roastLevel,
      origin: row.origin,
      tastingNotes: notes,
      process: row.process,
      altitude: row.altitude,
      batchSize: row.batchSize,
      imageSlug: row.imageSlug,
      imageAlt: row.imageAlt,
    });
  }
  if (visible.length > 4) {
    warnings.push(
      `You have ${publishedRows.length} roasts published; the page shows the first 4.`
    );
    visible.length = 4;
  }

  const now = Date.now();
  let source: ContentSource;
  if (state.lastSuccessAt === null) {
    source = 'fallback';
  } else if (state.lastFailureAt !== null && state.lastFailureAt > state.lastSuccessAt) {
    // The most recent COMPLETED refresh failed — the last good copy is showing.
    // (An in-flight refresh is not a failure: §7 pins that a routine
    // stale-while-revalidate pass never reads as degraded.)
    source = 'cache';
  } else {
    source = 'airtable';
  }

  return {
    content,
    roasts: visible,
    publishedCount: state.lastSuccessAt !== null ? state.publishedCount : publishedRows.length,
    totalRoastRows: totalRows,
    source,
    keyRejected: state.keyRejected,
    lastFetchedAt: state.lastSuccessAt ? new Date(state.lastSuccessAt).toISOString() : null,
    lastCheckedAt: state.lastAttemptAt ? new Date(state.lastAttemptAt).toISOString() : null,
    cacheAgeSeconds:
      state.lastSuccessAt !== null ? Math.floor((now - state.lastSuccessAt) / 1000) : null,
    warnings,
  };
}

/**
 * The one entry point for pages and endpoints.
 * Cold start: waits for the first read (so the first visitor gets live words).
 * Warm: serves immediately; an expired cache triggers one background refresh
 * (stale-while-revalidate) shared by all concurrent renders.
 */
export async function getResolvedContent(): Promise<ResolvedState> {
  const pending = ensureRefresh();
  if (pending && state.lastSuccessAt === null && !state.keyRejected) {
    // Nothing good to serve yet — wait for the first fetch (bounded by its own retries/timeout).
    await pending;
  }
  return buildResolved();
}

/** Non-blocking view for /health — never waits on Airtable. */
export function peekResolvedContent(): ResolvedState {
  ensureRefresh();
  return buildResolved();
}
