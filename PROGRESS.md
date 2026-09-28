# PROGRESS

## Done
- Airtable base created and fully seeded (owner confirmed 21 content rows; 3 roasts).
- Owner added the "Updated" (last modified time) column; helper tables pending owner deletion (cosmetic).
- Repo created. Foundation built and verified locally: tokens.css (§2 verbatim),
  Tailwind 4 theme bridge, app shell (header + roast line + skip link + footer),
  shared buttons/state matrix, counter-edge frame, obfuscated email links,
  data layer (Airtable read-only client, per-field resolution, cache/single-flight/retries),
  middleware (§7 headers, 405, rate limits, request ids, 500 screen),
  /health, /api/content, /robots.txt, /sitemap.xml, /media/* route with Range support,
  token lint script. Boots clean; headers verified; no literal email in HTML; CSP clean.

## In progress
- Section parcels: Hero, Roasts, Film, Story+Contact, Status+404, tests.
- Media generation pipeline (Higgsfield): master bag still → hero/roast stills → film → encode/derivatives.
  - Higgsfield reference job id for the accepted master: (not yet generated)

## Next
- Integrate parcels, generate media, wire manifest, self-check (§12 spot checks), push, deploy.
