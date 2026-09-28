# Ember & Oak

Small-batch coffee roasters — a one-page site that server-renders its words
from the owner's Airtable sheet (read-only), with a committed fallback for
every field so the page can never render blank.

Built by VibeStack Builder. The approved plan is `blueprint.md`; the reasons
behind non-obvious choices are in `decisions.md`.

## Stack

Astro 5 (Node adapter, standalone) · TypeScript · Tailwind CSS 4 themed from
`src/styles/tokens.css` · Lucide icons · self-hosted Fraunces + Karla ·
Airtable REST via fetch + zod · Playwright/axe/Vitest.

## Run it

```bash
npm ci
cp .env.example .env   # fill in the Airtable values (read-only token)
npm run dev            # local dev
npm run build && npm start   # production: binds HOST/PORT, serves dist
```

Without Airtable credentials the site serves its committed built-in copy and
`/status` says so — that is the designed degraded mode, not a crash.

## Layout

- `src/pages` — the one page, /status, 404, /health, /api/content, /media/*
- `src/lib` — env, Airtable client (read-only), cache + content resolution,
  validation, media manifest, rate limiting, obfuscation
- `src/content/fallback.ts` — the committed copy of every content field
- `src/components` — shell + sections
- `src/styles/tokens.css` — every visual value; `npm run lint:tokens` enforces
  that no raw hex/px appears in components
- `media/` — committed generated imagery and the roast clip (served by route)
- `assets/master/` — the media regeneration kit (bag spec, prompts, acceptance)
- `scripts/` — token lint and the media derivative pipeline
- `tests/` — Vitest + Playwright suites

## Endpoints

`GET /` · `GET /status` · `GET /health` · `GET /api/content` · `GET /media/*` ·
`GET /robots.txt` · `GET /sitemap.xml`. Every write method returns 405 — the
app has no write endpoint and no code path that writes to Airtable.
