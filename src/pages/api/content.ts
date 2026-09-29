/**
 * GET /api/content — the resolved page copy and roast cards as JSON (§7).
 * The same words already visible on the page; documented so the site stays portable.
 */
import type { APIRoute } from 'astro';
import { getResolvedContent } from '../../lib/content';

export const GET: APIRoute = async () => {
  const state = await getResolvedContent();
  const body = {
    source: state.source,
    fetchedAt: state.lastFetchedAt,
    content: state.content,
    // VisibleRoast is exactly the §7 wire shape (nine fields, in order).
    roasts: state.roasts,
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60',
    },
  });
};
