# PROGRESS

## Done
- Airtable base built and owner-seeded: Page Content (21 keys), Roast Profiles (3 rows, 2 published).
- Full site built: hero, roast cards, film, story, contact, /status, designed 404, robots.txt, sitemap.xml, /health, /api/content.
- Security headers, 405-on-writes, rate limits, /media/* immutable serving via middleware.
- Media mastered on owner's Higgsfield (record.json + acceptance.md); owner uploaded master-bag.png and roast-clip-raw.mp4; build pipeline derives AVIF/WebP/JPEG + 720p/480p H.264 + poster + OG card.
- 21 unit tests + 13 Playwright/axe e2e green; CI workflow live on GitHub (owner-copied; green on main).
- Deployed to Railway: https://ember-oak-production.up.railway.app — verify_live passed (health, page content, status, 404, robots).
- Design loop pass complete (3 rounds, all critics passing); owner accepted the design; review question closed; handoff delivered.
- Deploy-phase reconciliation: blueprint §8/§9/§10/§12 text adopted to shipped reality (decisions entry 20); known issues recorded.

## In progress
- (nothing)

## Next
- Owner-optional: flip Railway's "Wait for CI / check suites" toggle in their dashboard so a red check blocks deploys.
- Re-check decision 10 (no lockfile) if the push channel's file-size limit is ever lifted.
