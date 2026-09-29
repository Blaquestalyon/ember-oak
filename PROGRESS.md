# PROGRESS

## Done — BUILD COMPLETE, OWNER ACCEPTED
- Airtable base seeded (21 content rows, 3 roasts) — owner-confirmed.
- Full site built, tested (21 unit tests green), deployed and live-verified at
  https://ember-oak-production.up.railway.app (Live sheet, 4 of 4 media,
  all voice strings, no literal email, headers, 404/status/robots/sitemap).
- Review question closed: nothing missing.
- Design loop pass 1 (3 rounds × 3 fresh critics) complete; final round all
  PASS with measurements. Spec corrections recorded (decisions 13–16,
  blueprint §4 404-icon line).
- Owner ACCEPTED the design on the live site.
- Owner handbook (README-for-owner.md) committed. Handoff delivered.

## In progress
- Nothing. The build is closed.

## Next (for any future session)
- Changes arrive as change builds: the blueprint given at session start is the
  current plan; rebuild only affected parts; prove `npm run build` passes
  before pushing — every push redeploys the live site.
- Airtable schema ids: config/airtable-schema.json. Media regeneration kit:
  assets/master/ (masters + prompts + acceptance; job ids in record.json).
- Deploy: Railway project dc9775a0-ae22-4577-976c-8556d291e716, healthcheck
  /health, env in §10 (SITE_URL falls back to RAILWAY_PUBLIC_DOMAIN).
