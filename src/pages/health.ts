/**
 * GET /health — liveness + content-source truth (blueprint §7).
 * A degraded content source still returns 200, so an Airtable blip
 * never triggers a restart loop.
 */
import type { APIRoute } from 'astro';
import { peekResolvedContent } from '../lib/content';
import { mediaStatus } from '../lib/media';
import { env, bootedAt } from '../lib/env';

export const GET: APIRoute = () => {
  try {
    const state = peekResolvedContent();
    const media = mediaStatus();
    const body = {
      status: state.source === 'airtable' ? 'ok' : 'degraded',
      contentSource: state.source,
      lastFetchedAt: state.lastFetchedAt,
      cacheAgeSeconds: state.cacheAgeSeconds ?? 0,
      publishedRoasts: state.publishedCount,
      missingMedia: media.missing,
      warnings: state.warnings.length,
      version: env.version,
      uptimeSeconds: Math.floor((Date.now() - bootedAt) / 1000),
    };
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch {
    return new Response(JSON.stringify({ status: 'error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
};
