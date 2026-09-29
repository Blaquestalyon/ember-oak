/**
 * Per-IP rate limiting (blueprint §6): 120/min /health, 60/min /api/content,
 * 300/min everything else. Fixed one-minute windows, in memory.
 */

interface Bucket {
  windowStart: number;
  count: number;
}

const WINDOW_MS = 60_000;
const buckets = new Map<string, Bucket>();

/** Limit classes by path. */
export function limitFor(pathname: string): { name: string; max: number } {
  if (pathname === '/health') return { name: 'health', max: 120 };
  if (pathname === '/api/content') return { name: 'content', max: 60 };
  return { name: 'general', max: 300 };
}

export interface RateResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export function checkRateLimit(ip: string, pathname: string): RateResult {
  const { name, max } = limitFor(pathname);
  const key = `${ip}:${name}`;
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    bucket = { windowStart: now, count: 0 };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.windowStart + WINDOW_MS - now) / 1000)),
    };
  }
  // Opportunistic cleanup so the map cannot grow unbounded.
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) {
      if (now - b.windowStart >= WINDOW_MS) buckets.delete(k);
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Test hook. */
export function resetRateLimitsForTests(): void {
  buckets.clear();
}
