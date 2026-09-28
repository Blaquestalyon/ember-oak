/** GET /robots.txt — allows everything, points at the sitemap (§7). */
import type { APIRoute } from 'astro';
import { env } from '../lib/env';

export const GET: APIRoute = () => {
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${env.siteUrl}/sitemap.xml\n`;
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
