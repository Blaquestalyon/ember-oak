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

## 7. lucide-astro pinned to ^0.556.0
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
