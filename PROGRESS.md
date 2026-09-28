# PROGRESS

## Done
- Airtable base created and fully seeded (owner confirmed 21 content rows; 3 roasts).
- Foundation built, verified, pushed: tokens, shell, data layer, endpoints, middleware
  (incl. /media/* serving with immutable caching + Range), token lint.
- Media masters generated on the owner's Higgsfield (nano_banana_pro, 2K) and committed
  under assets/master/: accepted master (candidate 3, job 4a58b1ee-7220-4cb6-94f7-53d4276deb46),
  roast-light (job 56c9a874…), roast-dark (job be532fd2…), film source (job a72afb82…).
  Acceptance + prompts recorded in assets/master/{acceptance.md,record.json}.
- Film raw clip: generate_media video channel failed preflight twice (no job created,
  confirmed with owner); owner generated the 5s clip themselves on Higgsfield (Seedance 2.5,
  start frame = film source) and uploaded assets/master/roast-clip-raw.mp4 via GitHub UI. DONE — confirmed in repo.
- Media pipeline (scripts/media-pipeline.mjs) runs before astro build: sharp derivatives
  (AVIF/WebP/JPEG + LQIP + og-card) and ffmpeg film encode (720/480, -an, faststart,
  trim-to-final-5s). nixpacks.toml adds ffmpeg to the Railway build. Verified locally
  with synthetic masters; media/ is build output (gitignored).
- Status page (/status) and 404 page built and verified.

## In progress
- Section parcels out with the team: Hero, Roasts, Film, Story+Contact.

## Next
- Integrate parcels, review seams, full local self-check (§12 spot checks incl.
  literal-email greps, headers, states), tests/, push, deploy via railway_provision
  (env: AIRTABLE_*, SITE_URL, NODE_ENV, CONTENT_CACHE_TTL_SECONDS; healthcheck /health).
- NOTE for deploy: the real media masters live ONLY in the GitHub repo (generated straight
  into it); the local sandbox has placeholders removed. The Railway build clones the repo,
  so the pipeline sees the real masters there. Local verification of real derivatives is
  impossible in this sandbox (no git read access) — verify on the live URL after deploy.
