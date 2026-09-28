/**
 * Media manifest + boot-time presence check (blueprint §4, §5 flow 10).
 * The generation pipeline (scripts/media-pipeline.mjs) writes manifest.json;
 * this module reads it and compares every expected file against disk.
 * A missing file renders the section's designed fallback and is named on /status.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import rawManifest from '../media/manifest.json';

export interface ImageSet {
  /** Rendered widths, ascending. */
  widths: number[];
  /** Intrinsic size of the largest rendition. */
  width: number;
  height: number;
  /** Inline LQIP data URI (24px blurred preview). */
  lqip: string;
  /** format -> width -> public path, e.g. sources.avif["640"] = "/media/hero-640.abc123.avif" */
  sources: Record<'avif' | 'webp' | 'jpeg', Record<string, string>>;
}

export interface FilmSet {
  mp4720: string;
  mp4480: string;
  posterJpg: string;
  poster: ImageSet;
}

export interface MediaManifest {
  generated: boolean;
  hero: ImageSet | null;
  roastLight: ImageSet | null;
  roastDark: ImageSet | null;
  film: FilmSet | null;
  ogCard: string | null;
}

export const manifest = rawManifest as unknown as MediaManifest;

/** The four media sets the site expects (§4): hero, two roast stills, the film. */
const SET_NAMES = ['hero', 'roastLight', 'roastDark', 'film'] as const;

function setFiles(name: (typeof SET_NAMES)[number]): string[] {
  const entry = manifest[name];
  if (!entry) return [];
  if (name === 'film') {
    const film = entry as FilmSet;
    return [
      film.mp4720,
      film.mp4480,
      film.posterJpg,
      ...Object.values(film.poster.sources).flatMap((byWidth) => Object.values(byWidth)),
    ];
  }
  const image = entry as ImageSet;
  return Object.values(image.sources).flatMap((byWidth) => Object.values(byWidth));
}

/**
 * Media files live in the repo's media/ directory (served by the middleware),
 * so public paths like "/media/x.avif" map to "<cwd>/media/x.avif".
 */
function mediaRoot(): string {
  return join(process.cwd(), 'media');
}

function toDiskPath(publicPath: string): string {
  return join(mediaRoot(), publicPath.replace(/^\/media\//, ''));
}

export interface MediaStatus {
  /** e.g. "4 of 4" — sets fully present out of sets expected. */
  presentSets: number;
  expectedSets: number;
  /** Public paths of individual files that are expected but absent. */
  missing: string[];
  /** Set-level availability, used by sections to pick their fallback. */
  available: Record<(typeof SET_NAMES)[number], boolean>;
  ogCardPresent: boolean;
}

let cached: MediaStatus | null = null;

/** Boot-time (memoised) check of every expected media path against disk. */
export function mediaStatus(): MediaStatus {
  if (cached) return cached;
  const missing: string[] = [];
  const available = { hero: false, roastLight: false, roastDark: false, film: false };
  let presentSets = 0;

  for (const name of SET_NAMES) {
    const files = setFiles(name);
    if (files.length === 0) {
      // Not generated yet — the whole set is missing.
      missing.push(`${name} (not generated)`);
      continue;
    }
    const absent = files.filter((publicPath) => !existsSync(toDiskPath(publicPath)));
    if (absent.length === 0) {
      presentSets += 1;
      available[name] = true;
    } else {
      missing.push(...absent);
    }
  }

  let ogCardPresent = false;
  if (manifest.ogCard) {
    ogCardPresent = existsSync(toDiskPath(manifest.ogCard));
    if (!ogCardPresent) missing.push(manifest.ogCard);
  }

  cached = { presentSets, expectedSets: SET_NAMES.length, missing, available, ogCardPresent };
  return cached;
}

/** Test hook: forget the memoised check (the process re-checks on next call). */
export function resetMediaStatusForTests(): void {
  cached = null;
}
