/**
 * Airtable read-only client (blueprint §3, §6, §9).
 *
 * This module exports NO write function of any kind — the app contains no
 * code path that writes to Airtable (§3 access rule, §12 test 14).
 *
 * Retries: 3, at 250ms / 1s / 3s, only on 5xx, 429 and network errors.
 * On 401/403 it stops retrying and reports the key as rejected (§6).
 */
import { z } from 'zod';
import { env } from './env';

const contentRecordSchema = z.object({
  id: z.string(),
  fields: z.object({
    Key: z.string().optional(),
    Value: z.string().optional(),
    Section: z.string().optional(),
    'Max Length': z.number().optional(),
    Updated: z.string().optional(),
  }),
});

const roastRecordSchema = z.object({
  id: z.string(),
  fields: z.object({
    Name: z.string().optional(),
    'Roast Level': z.string().optional(),
    Origin: z.string().optional(),
    'Tasting Notes': z.string().optional(),
    Process: z.string().optional(),
    Altitude: z.string().optional(),
    'Batch Size': z.string().optional(),
    'Image Slug': z.string().optional(),
    'Image Alt': z.string().optional(),
    'Sort Order': z.number().optional(),
    Published: z.boolean().optional(),
  }),
});

const listResponseSchema = z.object({
  records: z.array(z.object({ id: z.string(), fields: z.record(z.unknown()) })),
  offset: z.string().optional(),
});

export type ContentRecord = z.infer<typeof contentRecordSchema>;
export type RoastRecord = z.infer<typeof roastRecordSchema>;

export interface AirtableSnapshot {
  content: ContentRecord[];
  roasts: RoastRecord[];
}

/** Thrown when the token is rejected — the caller must stop retrying (§6). */
export class AirtableAuthError extends Error {
  constructor(status: number) {
    super(`Airtable rejected the token (HTTP ${status})`);
    this.name = 'AirtableAuthError';
  }
}

const RETRY_DELAYS_MS = [250, 1000, 3000];
const API_ROOT = 'https://api.airtable.com/v0';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchTablePage(
  table: string,
  offset: string | undefined,
  signal: AbortSignal
): Promise<z.infer<typeof listResponseSchema>> {
  const url = new URL(`${API_ROOT}/${env.airtableBaseId}/${encodeURIComponent(table)}`);
  url.searchParams.set('pageSize', '100');
  if (offset) url.searchParams.set('offset', offset);

  let lastError: unknown = null;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAYS_MS[attempt - 1]!);
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${env.airtableApiKey}` },
        signal,
      });
      if (res.status === 401 || res.status === 403) {
        throw new AirtableAuthError(res.status);
      }
      if (res.status === 429 || res.status >= 500) {
        // Retryable. Never log or surface the response body (§7).
        lastError = new Error(`Airtable answered HTTP ${res.status}`);
        continue;
      }
      if (!res.ok) {
        throw new Error(`Airtable answered HTTP ${res.status}`);
      }
      const json: unknown = await res.json();
      return listResponseSchema.parse(json);
    } catch (err) {
      if (err instanceof AirtableAuthError) throw err;
      if (err instanceof z.ZodError) throw err;
      // Network error — retryable.
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Airtable unreachable');
}

async function fetchWholeTable(table: string, signal: AbortSignal): Promise<unknown[]> {
  const records: unknown[] = [];
  let offset: string | undefined;
  do {
    const page = await fetchTablePage(table, offset, signal);
    records.push(...page.records);
    offset = page.offset;
  } while (offset);
  return records;
}

/** Keep only the records a schema accepts (invalid rows are dropped, never fatal). */
function parseValid<T>(schema: z.ZodType<T>, records: unknown[]): T[] {
  return records.flatMap((record) => {
    const parsed = schema.safeParse(record);
    return parsed.success ? [parsed.data] : [];
  });
}

/**
 * Read both tables. Throws AirtableAuthError on a rejected key,
 * or a generic Error when Airtable stays unreachable after retries.
 */
export async function readSnapshot(): Promise<AirtableSnapshot> {
  if (!env.airtableApiKey || !env.airtableBaseId) {
    throw new Error('Airtable is not configured');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const [contentRaw, roastsRaw] = await Promise.all([
      fetchWholeTable(env.contentTable, controller.signal),
      fetchWholeTable(env.roastsTable, controller.signal),
    ]);
    return {
      content: parseValid(contentRecordSchema, contentRaw),
      roasts: parseValid(roastRecordSchema, roastsRaw),
    };
  } finally {
    clearTimeout(timeout);
  }
}
