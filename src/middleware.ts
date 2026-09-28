/**
 * Middleware (blueprint §6, §7): request ids, blanket 405 for writes, per-IP
 * rate limits, security headers on every response, route cache policies,
 * JSON 404s, the 500 error screen with a request id, and /media/* serving
 * (immutable caching + HTTP Range) from the repo's media/ directory.
 */
import { defineMiddleware } from 'astro:middleware';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, normalize, extname } from 'node:path';
import { Readable } from 'node:stream';
import { checkRateLimit } from './lib/rate-limit';
import tokensCss from './styles/tokens.css?raw';

const MEDIA_ROOT = join(process.cwd(), 'media');

const MEDIA_TYPES: Record<string, string> = {
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
};

/**
 * /media/* — committed media with the §7 immutable Cache-Control and HTTP
 * Range support (iOS video needs it). Served here because Astro's static
 * server sets neither, and the deploy needs one predictable code path.
 */
function serveMedia(pathname: string, request: Request): Response {
  const raw = decodeURIComponent(pathname.replace(/^\/media\//, ''));
  const safe = normalize(raw).replace(/^(\.\.[/\\])+/, '');
  if (safe.includes('..')) return new Response(null, { status: 404 });
  const filePath = join(MEDIA_ROOT, safe);
  if (!filePath.startsWith(MEDIA_ROOT) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    return new Response(null, { status: 404 });
  }

  const stat = statSync(filePath);
  const type = MEDIA_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
  const headers: Record<string, string> = {
    'Content-Type': type,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Accept-Ranges': 'bytes',
  };

  const range = request.headers.get('range');
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match) {
      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Math.min(Number(match[2]), stat.size - 1) : stat.size - 1;
      if (start <= end && start < stat.size) {
        const stream = createReadStream(filePath, { start, end });
        return new Response(Readable.toWeb(stream) as ReadableStream, {
          status: 206,
          headers: {
            ...headers,
            'Content-Range': `bytes ${start}-${end}/${stat.size}`,
            'Content-Length': String(end - start + 1),
          },
        });
      }
      return new Response(null, {
        status: 416,
        headers: { 'Content-Range': `bytes */${stat.size}` },
      });
    }
  }

  const stream = createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: { ...headers, 'Content-Length': String(stat.size) },
  });
}

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; " +
    "media-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; " +
    "base-uri 'none'; form-action 'none'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), camera=(), microphone=(), interest-cohort=()',
};

function applySecurityHeaders(res: Response): Response {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(name, value);
  }
  return res;
}

function cachePolicy(pathname: string): string | null {
  if (pathname === '/') return 'public, max-age=0, s-maxage=60, stale-while-revalidate=600';
  if (pathname === '/status') return 'no-store';
  if (pathname === '/api/content') return 'public, s-maxage=60';
  return null;
}

function wantsJson(request: Request): boolean {
  return (request.headers.get('accept') ?? '').includes('application/json');
}

function jsonError(code: string, status: number, requestId: string, extra?: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ error: code, requestId, ...extra }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/** Minimal branded 429/500 screens; all values from the token file. */
function utilityPage(title: string, body: string, status: number, requestId?: string): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Ember &amp; Oak</title>
<style>${tokensCss}
body{margin:0;min-height:100svh;display:grid;place-items:center;background:var(--bg-base);color:var(--text-primary);font-family:var(--font-body),system-ui,sans-serif;background-image:var(--drum-glow);}
main{max-width:var(--measure);padding:var(--space-7);text-align:center;}
h1{font-family:var(--font-display),Georgia,serif;font-weight:500;font-size:var(--step-display-l);line-height:var(--lh-display-l);margin:0 0 var(--space-4);}
p{color:var(--text-secondary);font-size:var(--step-body-l);line-height:var(--lh-body);margin:0 0 var(--space-5);}
small{color:var(--text-muted);font-size:var(--step-caption);}
a{display:inline-block;background:var(--accent-base);color:var(--accent-text-on-accent);text-decoration:none;border-radius:var(--radius-sm);padding:0 var(--space-4);line-height:var(--control-h);font-weight:600;}
a:hover{background:var(--accent-hover);}
a:focus-visible{outline:var(--focus-ring) solid var(--accent-base);outline-offset:var(--focus-ring);}
</style>
</head>
<body>
<main>
<h1>${title}</h1>
<p>${body}</p>
<a href="/">Back to the roastery</a>
${requestId ? `<p><small>Request id: ${requestId}</small></p>` : ''}
</main>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const requestId = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
  const { request } = context;
  const url = new URL(request.url);

  // Blanket rejection: the app implements no write endpoint (§7).
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return applySecurityHeaders(jsonError('method_not_allowed', 405, requestId));
  }

  // Per-IP rate limits (§6).
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || context.clientAddress || 'unknown';
  const rate = checkRateLimit(ip, url.pathname);
  if (!rate.allowed) {
    let res: Response;
    if (wantsJson(request)) {
      res = jsonError('rate_limited', 429, requestId, {
        retryAfterSeconds: rate.retryAfterSeconds,
      });
    } else {
      res = utilityPage(
        'Too many requests just now.',
        'Try again in a minute.',
        429
      );
    }
    res.headers.set('Retry-After', String(rate.retryAfterSeconds));
    return applySecurityHeaders(res);
  }

  // Committed media (§7): immutable caching + Range, from media/.
  if (url.pathname.startsWith('/media/')) {
    return applySecurityHeaders(serveMedia(url.pathname, request));
  }

  try {
    const response = await next();

    // JSON 404 envelope for API-style consumers (§4, §7).
    if (response.status === 404 && wantsJson(request)) {
      return applySecurityHeaders(jsonError('not_found', 404, requestId));
    }

    const policy = cachePolicy(url.pathname);
    if (policy && response.status === 200 && !response.headers.has('Cache-Control')) {
      response.headers.set('Cache-Control', policy);
    }
    return applySecurityHeaders(response);
  } catch (err) {
    // The request id is logged with the stack; upstream bodies are never logged (§7).
    console.error(`[${requestId}]`, err instanceof Error ? err.stack : err);
    if (wantsJson(request)) {
      return applySecurityHeaders(jsonError('server_error', 500, requestId));
    }
    return applySecurityHeaders(
      utilityPage(
        'Something broke on our side.',
        'Give it a moment and refresh — the roastery is otherwise open.',
        500,
        requestId
      )
    );
  }
});
