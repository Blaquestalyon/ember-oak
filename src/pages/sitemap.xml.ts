/** GET /sitemap.xml — one URL: the site root (§7). */
import type { APIRoute } from 'astro';
import { env } from '../lib/env';

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${env.siteUrl}/</loc></url>\n</urlset>\n`;
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
