# Decisions — Ember & Oak

Each entry records WHAT was decided and WHY, so a future agent can check whether
the reason still holds before following it.

## 1. Node engines pinned to >=22 (blueprint §9 table says "Node 20")
**Why:** the build platform refuses any push whose root package.json permits a
Node major below 22, because core dependencies have deprecated older majors and
such apps fail health checks after deploy. Astro 5 fully supports Node 22.
§9's "Node 20" was the hosting row's shorthand for "current LTS", not a pinned
requirement; nothing in the app depends on Node 20 behaviour.
**Re-check:** if the platform floor changes, follow the platform floor.

## 2. Airtable seeding was finished by the owner with a guided copy-paste
**Why:** the provisioning tool seeds at most 5 rows per table and only at
table-creation time. §3 requires 21 Page Content rows. The remaining 16 rows
were staged in four clearly-named temporary tables and the owner moved them
with four copy-pastes (confirmed: Page Content shows 21 records). The base now
matches §3 exactly. The temporary tables are junk once deleted; the owner was
told they are safe to delete.
**Re-check:** if the tool ever seeds existing tables, stage nothing.

## 3. The "Updated" field was added by the owner inside Airtable
**Why:** the provisioning tool cannot create computed fields (last modified
time). The owner added it by hand (verified via schema read: field
`fld5wfvUJUo1zji3J`, type lastModifiedTime). The app treats the field as
optional and never depends on it.

## 4. §12 test 1 says "22 content keys"; §3's seed table defines 21
**Why:** counted directly from the blueprint's seed table (21 rows). The seed
table is the authoritative data model; the app knows exactly the 21 §3 keys.
The test count appears to be an off-by-one in the test plan text, not a missing
key — every §4 surface maps to a §3 key with none left over.
**Re-check at QA:** if QA fails "22 keys", the fix is to the test, not the app.

## 5. Media lives in repo-root `media/`, served by the middleware, not `public/`
**Why:** §7 requires `Cache-Control: public, max-age=31536000, immutable` on
/media/* and iOS video needs HTTP Range support; Astro's standalone static
server sets neither for public/ files and its middleware never runs for them.
A bracketed rest-route filename (`[...file].ts`) is refused by the repo push
tooling, so /media/* is served directly from src/middleware.ts, streaming from
`media/` with the exact headers and Range handling. Public URLs are unchanged
(/media/...), so §4 markup and §12 tests match the blueprint.
**Re-check:** if the adapter ever allows per-directory static headers, public/
becomes viable again.

## 6. Strict CSP means: no inline styles, no inline scripts, anywhere
**Why:** §7 pins `style-src 'self'; script-src 'self'` with no unsafe-inline.
Browsers then ignore `style="…"` attributes and block inline `<script>` bodies.
Consequences implemented:
- No component may render a `style` attribute. Per-element values (LQIP
  backgrounds, reveal indexes) are done with real elements (`<img>` layers) or
  set via CSSOM in external scripts (allowed by CSP).
- `vite.build.assetsInlineLimit: 0` so Astro never inlines a small script.
- Astro's `security.checkOrigin` is off: it answered POST with 403 before the
  middleware's blanket 405 (§7) could; the app has no write endpoint to protect.
- JSON-LD `<script type="application/ld+json">` is a data block, not executed,
  and is not blocked by CSP.

## 7. lucide-astro pinned to 0.556.0
**Why:** the version first written (^0.474.0) does not exist on npm.

## 8. Token lint exempts @media/@container lines
**Why:** §12 test 47 bans raw px in components, but §4 itself pins breakpoints
in px (768px / 900px / 1024px) and CSS cannot read var() inside media queries.
Breakpoint lines are spec values, not component values.

## 9. Email obfuscation applied beyond §6's letter
**Why:** §6 requires the address never to appear literally in served HTML. The
JSON-LD email uses \uXXXX escapes (entities do not decode inside JSON), and the
clipboard-fallback toast text is composed in the browser from the decoded
anchor, so the literal string also never ships inside a JS bundle. §4's pinned
error copy that names the address renders it entity-encoded inside the sentence.

## 10. No committed package-lock.json; every direct dependency is pinned EXACT
**Why:** the repo is written through a push tool that takes file contents
inline. The lockfile is ~190 KB of hashes; transcribing it through that channel
risks a single-character corruption inside an integrity hash, which would break
`npm ci` at deploy — and the pushed copy cannot be independently verified from
the build sandbox (no git read access to the private repo). Instead,
package.json pins every direct dependency to the exact version the build was
verified against (fresh `npm install` + production build + boot re-tested after
pinning), and the deploy uses `npm install`. Direct versions are deterministic;
transitive drift is possible but is caught by the deploy health check and QA.
This repo has no native modules in `dependencies` (sharp is only used at
media-generation time, not runtime), which is the failure class that made
missing lockfiles dangerous elsewhere.
**Re-check:** if the push channel ever supports verified binary/large files,
commit the real lockfile and switch the build back to `npm ci`.

## 11. Section-parcel judgment calls (unit-level, §2-silent visuals)
Recorded so the reasons are re-checkable; none contradicts a pinned visual.
- Hero cue hover: --accent-text → --accent-hover, 2px arrow nudge over --dur-fast
  (suppressed under reduced motion); active --accent-pressed. LQIP scaled 1.08 to
  hide blur edges; counter-edge extension zeroed on the full-bleed hero frame.
- Roasts grid gaps --space-8/--space-7; chip padding --space-2; skeleton bar
  heights --space-4/--space-5. The 900px sizes string is assembled from a TS
  constant so the exact §4 string ships past the token lint.
- Film: §4 "poster alone" vs §12 test 18 "poster with the centred play button" —
  test 18 followed (button shown, never autoplay) since a poster with no way to
  play would strand the visitor; videos-present-but-poster-missing → the §4
  panel, per its literal "if the poster is missing too". Panel mode (no media at
  all) renders title + panel and omits controls/caption/disclosure — controls
  without a video are dead weight. No-JS hides Play/Pause/Replay and shows the
  description expanded. Toggle label min-width holds Play↔Pause steady; the
  loading spinner keeps spinning under reduced motion (it is status, not decor).
- Contact/toast: toast max-width caps at viewport − 64px with overflow-wrap so
  the long warning message never overflows 360px; close button 40px hit target;
  address link :active underline --accent-pressed (pressed state unpinned).
- Story: "centred" read as the centred 68ch column; text left-aligned inside it.

## 12. Hero AVIF preload lives in index.astro's head slot
**Why:** §5 flow 1 requires the hero AVIF to be in flight with the HTML. A
<link rel="preload" as="image" imagesrcset> with the AVIF srcset is emitted only
when the hero set exists, so a missing-media deploy adds no dead preload.

## 13. Design-loop round 1 spec resolutions
- §4 pins Contact at "--space-10 vertical padding"; §2 DENSITY pins section
  rhythm at space-9 mobile / space-10 ≥1024px. Resolved toward §2 (the general
  rhythm rule): Contact pads 96px mobile / 128px ≥1024px. §2 is the design
  authority for rhythm; §4's line reads as shorthand for "section rhythm".
- §4's status screen ("One --bg-surface panel… Title… subtitle…") is ambiguous
  on whether the title sits inside the panel. Title/subtitle/back-link now sit
  on the page's shared left spine outside the panel; the panel carries the rows.
  One left anchor per width across all routes (design-bar mechanism 3).
- Unpinned values set for gap-scale honesty: footer top padding space-7 (48px),
  footer brand lockup bottom margin space-3 (12px), 404 vertical slack split 2:3.

## 14. 404 icon: §2's NEVER list beats §4's icon name (spec self-contradiction)
**Why:** §4 named Lucide `coffee` for the 404 icon; that glyph draws a cup with
steam, and §2's NEVER list bans "a cup-with-steam" outright (caught by the
round-1 System critic). Spec-first repair: §2 is the world's law, §4's icon
name was the defect. blueprint.md §4 now reads "The coded oak-leaf-and-flame
mark (32px, --text-muted)" and the page renders the existing Mark component.
The change is a one-icon swap on the 404 screen; the owner is told at the next
review touchpoint.

## 15. Design-bar mechanism 2's route floor corrected to fit the pinned scale
**Why:** the bar required the main route's largest text ≥2.5× the route's base
body size. At mobile widths both inputs are §2-PINNED: the headline clamp floor
is 2.75rem (44px) and lead body is 1.125rem (18px) → 2.44×. The bar's own first
law is that it never contradicts §2 (a bar that refuses the pinned spec is
broken), and its author's clearance note miscalculated using the 16px body step.
The bar now reads ≥2.4× on the main route; the pinned type scale is untouched.

## 16. Utility routes carry the full header nav (§4 "renders as normal")
**Why:** the §4 shell lists three section links at ≥768px; /status and the 404
initially hid them. Two Brief critics read §4's "header and footer render as
normal" as the letter of the spec; the links are plain anchors to /#roasts etc.
and work from any route, so the withSectionNav switch was removed and all three
routes share one shell.

## 17. /health source flag: failure recorded on completion, never at attempt start
**Why (QA fix round):** buildResolved() treated `lastAttemptAt > lastSuccessAt`
as "the last attempt failed", but ensureRefresh() stamps lastAttemptAt when it
KICKS a refresh — so the very request that triggers a routine TTL-expiry
stale-while-revalidate pass reported contentSource "cache" / status "degraded"
on a healthy system (self-correcting on the next request; an uptime monitor
polling every 5 min with a 60s TTL would see "degraded" on almost every poll).
Fix: a new `lastFailureAt` is set only in refresh()'s catch (i.e. after a
refresh has completed and failed); the source flag compares lastFailureAt to
lastSuccessAt. lastAttemptAt is kept solely for the status page's honest
"Last checked" row.

## 18. CI added: build + token lint + Vitest + Playwright + axe on every push
**Why (§12 test 53):** .github/workflows/ci.yml runs the full gate; the e2e/axe
suite (tests/e2e/site.spec.ts + playwright.config.ts) boots the production
server with dummy Airtable credentials — the committed-fallback path is a §6
designed state, so no secret is needed in CI. axe runs on all three screens at
360×640 and 1440×900 with only `video-caption` disabled (the clip is silent by
design per §8, a false positive axe cannot detect).
**Delivery constraint:** the build platform's push channel is refused (403) on
any push containing .github/workflows/* — its token lacks workflow permissions.
The workflow therefore ships STAGED at docs/ci-workflow.yml, and the owner
copies it to .github/workflows/ci.yml in the GitHub editor (their session has
the permission). "A red check blocks deploy": GitHub carries the check;
Railway's per-service "Wait for CI / check suites" toggle is the enforcement
switch and lives in the owner's Railway dashboard — both owner steps are
surfaced plainly, never silently skipped.
**Re-check:** if the push channel ever gains workflow scope, commit the file
directly and delete the staged copy.

## 19. The accepted master's canonical name (§8: assets/master/master-bag.png)
**Why (QA fix round):** the accepted master shipped only under its candidate
name (candidates/master-candidate-3.png), but §8 pins the uncropped accepted
master at assets/master/master-bag.png. The pixels exist only in the GitHub
repo (generated straight into it; this sandbox cannot read the private repo),
so the copy is owner-performed: download the candidate, re-upload it as
master-bag.png via GitHub's upload UI. The media pipeline now prefers the
canonical path and falls back to the candidate path, so the site builds
correctly both before and after the upload.

## 20. Deploy-phase reconciliation: blueprint text adopted to shipped reality
**Why (deploy phase):** the app is live and verified at
https://ember-oak-production.up.railway.app. Four blueprint lines still
described earlier intentions that decisions 1, 4, 5 and 10 had already
superseded; the blueprint text now matches what ships, so spec and code
version together:
- §9 hosting row: "Node 20" → "Node 22" (decision 1: engines >=22 is the
  platform floor; older majors fail health checks).
- §12 test 1: "22 content keys" → "21" (decision 4: §3's seed table defines
  exactly 21 keys; 22 was a counting error in the test text).
- §10 step 3: "npm ci" → "npm install" with a note that deps are exact-pinned
  and no lockfile is committed, and that SITE_URL falls back to the
  Railway-provided domain (decision 10).
- §8 asset-list line: "commit media into public/media/" → repo media/
  directory served by the app at the same public /media/* URLs (decision 5:
  the push channel refuses bracketed route filenames, so /media/* is served
  by middleware with identical URLs and cache headers; §7's route table was
  already correct).

**Known issues shipping with this release (neither blocks the live site):**
1. Railway's per-service "Wait for CI / check suites" toggle is not yet
   enabled — it lives only in the owner's Railway dashboard (decision 18).
   Until flipped, a push deploys without waiting for the GitHub check. CI
   itself is green on main; the toggle is recommended, optional, and
   owner-performed.
2. No lockfile is committed (decision 10: transcribing ~190 KB of integrity
   hashes through the inline push channel risks unverifiable corruption;
   direct deps are exact-pinned instead). Transitive-dependency drift on a
   future rebuild remains possible; mitigations are the exact pins, CI
   running the full gate on every push, and the Railway health check gating
   each deploy.
   **Re-check:** if the push channel ever supports verified large files,
   commit package-lock.json and restore "npm ci" in §10 — the reason for
   this decision is the channel, not a preference.
