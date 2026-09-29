/**
 * Environment configuration. All config via env vars (blueprint §10).
 * In production the server fails loudly at boot, naming any missing var.
 */

export interface Env {
  nodeEnv: string;
  airtableApiKey: string | null;
  airtableBaseId: string | null;
  contentTable: string;
  roastsTable: string;
  cacheTtlSeconds: number;
  siteUrl: string;
  version: string;
}

function readEnv(): Env {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProd = nodeEnv === 'production';

  // SITE_URL (§10) with a host fallback: Railway publishes the generated
  // domain as RAILWAY_PUBLIC_DOMAIN, so a fresh deploy has a canonical URL
  // before the owner sets a custom one. SITE_URL, when set, always wins.
  const siteUrlRaw =
    process.env.SITE_URL?.trim() ||
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : '');

  const missing: string[] = [];
  const required = ['AIRTABLE_API_KEY', 'AIRTABLE_BASE_ID'] as const;
  for (const name of required) {
    if (!process.env[name] || process.env[name]?.trim() === '') missing.push(name);
  }
  if (!siteUrlRaw) missing.push('SITE_URL');
  if (isProd && missing.length > 0) {
    // Fail loudly at boot, naming every missing var (§10).
    throw new Error(
      `Missing required environment variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}. ` +
        'Set them in the hosting dashboard and redeploy.'
    );
  }
  if (!isProd && missing.length > 0) {
    console.warn(
      `[env] Missing ${missing.join(', ')} — serving the committed built-in copy (development only).`
    );
  }

  const ttlRaw = Number(process.env.CONTENT_CACHE_TTL_SECONDS ?? '60');
  const cacheTtlSeconds = Number.isFinite(ttlRaw) && ttlRaw > 0 ? ttlRaw : 60;

  // Deploy id: Railway exposes the git SHA; fall back to a local marker.
  const sha =
    process.env.RAILWAY_GIT_COMMIT_SHA ?? process.env.COMMIT_SHA ?? process.env.SOURCE_VERSION ?? '';
  const version = sha ? sha.slice(0, 7) : 'local';

  return {
    nodeEnv,
    airtableApiKey: process.env.AIRTABLE_API_KEY?.trim() || null,
    airtableBaseId: process.env.AIRTABLE_BASE_ID?.trim() || null,
    contentTable: process.env.AIRTABLE_CONTENT_TABLE?.trim() || 'Page Content',
    roastsTable: process.env.AIRTABLE_ROASTS_TABLE?.trim() || 'Roast Profiles',
    cacheTtlSeconds,
    siteUrl: (siteUrlRaw || 'http://localhost:4321').replace(/\/+$/, ''),
    version,
  };
}

export const env: Env = readEnv();

/** Server start time, for the status page's uptime row. */
export const bootedAt = Date.now();
