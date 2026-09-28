# Ember & Oak — Blueprint

## How to use this blueprint
This blueprint is yours. It describes the whole website in enough detail that any competent developer or AI agent could build it from this document alone, on any reasonable stack — or you can let VibeStack Builder build it for you, flawlessly, with no code from you, ever. It runs on accounts you own: your hosting, your Airtable sheet, your Higgsfield account for the pictures. Nothing here is locked to one vendor; §9 names the recommended tools and says plainly what each could be swapped for.

---

## 1. What this app is

**Where it lives:** a website in a browser — one link that opens on any phone, tablet or computer. There is no phone app, nothing to install, and nothing to sign into.

**What it exists to do (the primary objective):** convince a stranger, in one scroll, that Ember & Oak roasts coffee worth seeking out — and give them one unmistakable way to make contact. Everything on the page serves that: the photograph of the bag, the two roasts, the five seconds of a bean turning dark, the story, the address.

**Supporting features (helpful, but not the point):** the roast cards' details (origin, process, altitude, batch size), the owner's editable content sheet, the status page, the "copy address" button, the sharing card for social posts. If a build decision ever has to be made between these and the five items above, the five items above win.

**Roles:**

| Role | Who they are | What they can do and see |
|---|---|---|
| **Visitor** | Anyone with the link. No account, ever. No way to create one. | Read the whole page; play, pause and replay the clip; open or copy the email address; view the status page and the 404 page. Cannot submit, save, upload or change anything — the site exposes no write operation of any kind. |
| **Owner (Ember & Oak)** | You. | Edit the page's words and the roast cards inside Airtable (outside the website, protected by your Airtable login); approve or reject the generated pictures at build time; redeploy or roll back the site from the hosting dashboard. You never sign into the website itself, because the website has no sign-in. |

There is no admin role inside the app and no admin screen behind a password. That is deliberate: you asked for no logins, and the only thing that would need protecting — your own words — is already protected by Airtable's own login.

---

## 2. Design brief

### WORLD

**MOOD.** Five-forty in the morning in a brick room on the edge of town: the drum is up to temperature, one lamp is on over the counter, and the light has not arrived yet. The page is that room. It is dim, warm, and unhurried, and the only bright thing in it is heat.

**COLOUR PLACEMENT.**
- *Charcoal* `#131110` and *ink* `#0B0A09` carry every surface: the page background, the header, the footer, the panels behind the roast cards. They are the room.
- *Ember-orange* `#E2662B` appears **only where heat appears**: the drum-glow wash beneath the hero photograph, the printed band on the bag inside the photographs, the roast-line scroll indicator, the underline under the email address, the focus ring, and the single filled button ("Email us"). It never fills a card, never tints body text, never appears in the footer, and never covers more than about a tenth of any screen.
- *Oak-brown* `#5A3A26` appears **only** as the counter-edge hairline that runs out of every photograph, and as the charred end of the roast line.
- *Bean-green* `#7E8B5A` appears in exactly two places: the start of the roast line at 0% scroll, and the unroasted bean inside the film.
- *Warm off-white* `#F5EFE7` is reserved for the headline, the wordmark and body text. Nothing else is this bright.

**LIGHT.** One warm source, low and to the left, at the height of a countertop. It rakes across surfaces instead of flooding them; shadows fall long to the right and die into the background rather than stopping at an edge. In the interface, elevation is never a grey drop shadow: a raised surface is a 1px warm hairline `#2A2320` plus a 1px inset top highlight `rgba(245,239,231,0.05)`. In every generated photograph and in the film, the same rule holds — one low warm key at roughly 30°, no fill light, no rim light from behind, no studio softbox reflection anywhere in the bag's laminate.

**MOTIFS.**
1. *The counter edge.* Every photograph and the film sit in a frame whose bottom border is a 1px oak hairline that continues past the image to the left and right viewport edges, as if the counter runs on out of frame. Top two corners are `14px`; bottom corners are square, so the media sits on the line rather than floating.
2. *The roast line.* A 2px horizontal line pinned to the top edge of the sticky header whose width tracks page scroll and whose colour travels green → ember → charred.
3. *The roast-log label.* Letterspaced capitals at `0.75rem` with tabular figures, label left / value right, separated by a 4px gap and a hairline — the voice of a roast log, not of marketing copy.

**NEVER.** Never pure `#000` — every dark here is warm stone. Never blue-grey shadows. Never a cup-with-steam, a hand-drawn bean, a burlap-sack texture or a chalkboard. Never a script or "artisan" brush font. Never pill-shaped gradient buttons. Never a hero carousel, never parallax on the photographs, never a cookie banner, never a "Shop now" affordance of any kind. Never a light mode (see posture).

### LINEAGE

Starting point: **Atrium** — editorial warmth, generous rhythm, an expressive display face over a quiet body, unhurried motion. It departs from Atrium on two axes: the light warm paper is inverted into a dark room lit by a single source, and Atrium's soft layered shadows are replaced entirely by warm hairlines and one ember glow, so depth reads as *lamplight on wood* rather than as *cards floating on a desk*.

### COLOR

Anchor: **`#E2662B`** (ember). Neutral temperature: **stone / warm grey**.

Ramp:

| Token | Hex | Role |
|---|---|---|
| `--accent-subtle-bg` | `#2B1409` | the drum-glow wash, the roast-line trough |
| `--accent-hover` | `#F07A3C` | button hover fill, link hover underline |
| `--accent-base` | `#E2662B` | button fill, focus ring, roast-line mid-stop |
| `--accent-pressed` | `#B84E1D` | button active/pressed fill |
| `--accent-text-on-accent` | `#14100D` | text and icons on an ember fill |
| `--accent-text` | `#F2854A` | **working-shade shift** — ember at caption size |

**WCAG AA result.** `#E2662B` on `#0B0A09` = **5.81:1** (passes AA body). `#14100D` on `#E2662B` = **5.60:1** (passes AA — dark ink on the ember button, never white). `#F5EFE7` on `#0B0A09` ≈ **17:1**. `--text-secondary #C9BDB1` = **10.7:1**. `--text-muted #948579` = **5.55:1** (still AA body, so muted text is never a contrast failure). Working-shade shift: at `0.875rem` and below, ember text switches to `#F2854A` (**7.75:1**) so captions and micro-labels sit well clear of the 4.5:1 line; ember at `#E2662B` is used for fills, borders, the focus ring and large marks only.

### POSTURE

**Dark only.** No light mode ships. The app's world is a dim room before sunrise; a light variant would describe a different business. The dark palette meets AA at every specified pairing, so this costs nothing in accessibility.

### TYPE

Two families, self-hosted via `@fontsource`, subset to latin, `woff2`, preloaded, `font-display: swap` with `size-adjust` fallback metrics so nothing shifts on load.

- **Display — `Fraunces Variable`** (`@fontsource-variable/fraunces`), `wght 500`, `opsz 72`, `SOFT 30`, `WONK 1`. Warm, slightly wonky, crafted — a roaster's hand rather than a luxury hotel's.
- **Body / UI / data — `Karla Variable`** (`@fontsource-variable/karla`), `400` and `600`, `font-variant-numeric: tabular-nums` globally on values and labels.

Deliberately **no third mono family** (two families max): the "roast log" register is achieved with Karla `600` uppercase at `0.75rem`, `0.14em` tracking, tabular figures.

| Role | Token | Value |
|---|---|---|
| Hero display | `--step-display-xl` | `clamp(2.75rem, 7.5vw, 6rem)` / `1.08` / Fraunces 500 |
| Section title | `--step-display-l` | `clamp(2rem, 4.5vw, 3.5rem)` / `1.12` / Fraunces 500 |
| Sub-head | `--step-h2` | `clamp(1.625rem, 3vw, 2.25rem)` / `1.18` |
| Card title | `--step-h3` | `1.375rem` / `1.2` |
| Lead body | `--step-body-l` | `1.125rem` / `1.6` |
| Body | `--step-body` | `1rem` / `1.6`, measure `68ch` |
| Caption | `--step-caption` | `0.875rem` / `1.5` |
| Label | `--step-label` | `0.75rem` / `1.4`, uppercase, `0.14em` |

### DENSITY, RADIUS, ELEVATION

- **Density:** comfortable. Section vertical rhythm `--space-9` (96px) on mobile, `--space-10` (128px) at ≥1024px.
- **Radius:** `--radius-sm 4px` (buttons, chips), `--radius-md 8px` (panels), `--radius-lg 14px` (top corners of media frames only). No pills except the 8px status dot.
- **Elevation:** borders-only. `--elev-hairline: inset 0 1px 0 rgba(245,239,231,.05), 0 0 0 1px var(--border-hairline)`. One exception: `--elev-glow: 0 0 40px -12px rgba(226,102,43,.45)`, used on the roast-line tip and the primary button's hover state and nowhere else.

### TOKENS (the complete file — `src/styles/tokens.css`)

```
--bg-base:#0B0A09; --bg-surface:#131110; --bg-raised:#1C1917; --bg-sunken:#060505;
--border-hairline:#2A2320; --border-strong:#3A302A;
--text-primary:#F5EFE7; --text-secondary:#C9BDB1; --text-muted:#948579;
--accent-subtle-bg:#2B1409; --accent-hover:#F07A3C; --accent-base:#E2662B;
--accent-pressed:#B84E1D; --accent-text:#F2854A; --accent-text-on-accent:#14100D;
--oak:#5A3A26; --char:#4A2E1F; --bean-green:#7E8B5A;
--success:#6FB07A; --warning:#E0A94A; --danger:#E0684E; --info:#7FA6C9;
--font-display:'Fraunces Variable',Georgia,serif; --font-body:'Karla Variable',system-ui,sans-serif;
--step-display-xl … --step-label (table above); --lh-tight:1.08; --lh-heading:1.18; --lh-body:1.6;
--measure:68ch; --track-label:.14em;
--space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-5:24px;
--space-6:32px; --space-7:48px; --space-8:64px; --space-9:96px; --space-10:128px;
--radius-sm:4px; --radius-md:8px; --radius-lg:14px; --radius-full:999px;
--elev-hairline:…; --elev-glow:…;
--dur-fast:140ms; --dur-base:220ms; --dur-slow:280ms;
--ease-out:cubic-bezier(.16,1,.3,1); --ease-in:cubic-bezier(.4,0,1,1);
--z-base:0; --z-media:10; --z-header:100; --z-toast:200;
```

Every visual value in the app comes from this file through Tailwind's theme. No raw hex and no raw px in any component file; a lint rule enforces it (§12).

### MOTION

Hovers and toggles `--dur-fast` (140ms). Section entrances, toasts and disclosures `--dur-base` (220ms). The film's poster→playback cross-fade `--dur-slow` (280ms). Entrances use `--ease-out`, exits `--ease-in`. Scroll reveal: each section's children rise `16px` and fade in over `240ms`, staggered `60ms`, triggered once at 20% visibility. Under `prefers-reduced-motion: reduce`: all reveals collapse to a `120ms` opacity fade with no translate, the roast-line tip loses its glow animation (the line still tracks scroll), and the film does **not** autoplay — the poster and a play button are shown instead.

### SIGNATURE MOMENTS

**1. The roast line.** A 2px line pinned flush to the top edge of the sticky header, full viewport width, `--z-header`. Its filled width equals the page scroll fraction (`scrollY / (documentHeight − viewportHeight)`, clamped 0–1), updated inside a `requestAnimationFrame` loop throttled to one paint per frame. Its fill is a three-stop gradient sampled across the *filled portion only*: `--bean-green #7E8B5A` at 0%, `--accent-base #E2662B` at 60%, `--char #4A2E1F` at 100% — the roast curve, drawn as you read. A 12px `--elev-glow` sits at the leading tip and pulses opacity `.5 → 1 → .5` over `2400ms`; under reduced motion the glow is static at `.7`. On a fully-scrolled short viewport the line is 100% and the tip rests at the right edge. It is decorative: `aria-hidden="true"`.

**2. The counter edge.** Every media frame (hero, both roast photographs, the film) is wrapped in a figure whose bottom border is a 1px `--oak` line, and that line is extended beyond the figure to both viewport edges by a pseudo-element, at 40% opacity outside the frame and 100% inside it. Media corners: `14px 14px 0 0`. The effect is that all four pieces of imagery sit on one continuous counter running the length of the page. On mobile the extension shortens to the container's gutter rather than the full viewport, so it never causes horizontal overflow.

### VOICE

- Empty (no roasts published): **"Nothing on the counter yet."** / "Today's roasts appear here as soon as they're added to the sheet."
- Toast (address copied): **"Address copied. We read every one."**
- Error (content couldn't be reached): **"The kettle's off."** / "We couldn't load the roast notes just now. Refresh in a moment, or email us at thebag@power-in-numbers.net."
- 404: **"That page went cold."** / "There's only one page here, and it's this way." → button **"Back to the roastery"**

### MEDIUM

The interview established a visual requirement: photoreal imagery and footage, warm and dim, with one identical bag across every shot. Each surface that carries the app's own claim about itself is therefore made of:

| Surface | Medium | Capability reason |
|---|---|---|
| Hero — the bag on the oak counter | **generated still** | The page's claim is "this is our coffee, in our room." A claim about a photographed product is evidenced with a photograph; code cannot draw laminate, crumb, grain and falloff at this standard. |
| Light-roast photograph | **generated still** | Same claim, second angle — must be the same bag, so it is derived from the hero master rather than prompted fresh. |
| Dark-roast photograph | **generated still** | As above. |
| The five-second roast | **generated motion** | The claim is a *transformation over time* — green bean to dark. Stills in sequence are not footage, and code cannot render a bean scorching. |
| Wordmark, oak-leaf-and-flame mark, favicon, drum-glow wash, counter edge, roast line, icons, all UI chrome | **coded** | Must stay crisp from 16px to 6rem, must follow the tokens exactly, must never drift on regeneration, and costs nothing. |
| Story text, contact address, roast notes | text | Drafted (§3 seed) and owner-editable. |

No **3D** asset is produced and none is needed. No **owner-supplied** media exists — the owner has no photographs, no logo and no reference images, so everything above is created for them. No audio: the film ships silent (§8).

*Named plainly:* these are photoreal **generated** images and a photoreal **generated** clip, not camera work, and the bag in them is a bag designed to the written spec in §8, not a photograph of the owner's real packaging. Both facts are disclosed in the plan summary, not just here.

### REFERENCES

| Reference | Taken |
|---|---|
| Amrit Palace | The proportion of the hero: a near-black photographic field with the display line held to the lower-left third and a small byline beneath it, warm metal on near-black — but the gold ornament is dropped entirely for one ember band. |
| 11x | The cinema-poster crop — image edge-to-edge behind the type, headline set enormous and baselined to a hairline rule, one warm earth tone carrying the entire frame instead of a palette. |
| Integrated Biosciences | The unloaded→loaded posture: a black stage that resolves into a lit macro surface; the lower-left caption block and a single small control pinned to the lower-right as the only chrome on the hero. |
| 21 TSI | The single-hue void discipline — one field, one subject, everything else removed — and the defocus→focus entrance, adapted as the film's poster→playback cross-fade. |
| Steep | The italic phrase inside an otherwise roman display line, used once, for the story's emphasis clause. |
| Superhuman | Editorial warmth sitting on a strict token grid — expressive type, but every space, radius and duration from a named token rather than by eye. |

---

## 3. Data model

**Database: Airtable.** The site stores nothing about visitors — no accounts, no orders, no submissions, no cookies — so the only data is the owner's own copy and two roast cards. Airtable gives the owner a friendly spreadsheet to edit that copy without code and is free at this volume. The app reads it server-side with a **read-only** token, caches it for 60 seconds, and ships a committed fallback copy of every field so the page can never render blank.

Base name: **"Ember & Oak — Site Content"** (one base, two tables).

### Table: Page Content

Every word on the page, addressed by a stable key.

| Field | Type | Required | Notes |
|---|---|---|---|
| `Key` | Single line text — **primary field, unique** | yes | e.g. `hero.headline`. Must match `^[a-z]+\.[a-z_]+$`. Unknown keys are ignored by the app. |
| `Value` | Long text | yes | The text shown on the page. Plain text only — no HTML is ever rendered from this field. |
| `Section` | Single select: `Meta`, `Hero`, `Roasts`, `Film`, `Story`, `Contact`, `Footer` | yes | Groups the rows for the owner's grid views. |
| `Max Length` | Number (integer, 0 decimals) | yes | The limit enforced in §6. |
| `Notes` | Long text | no | Plain-English guidance for the owner: what this text does and where it appears. |
| `Updated` | Last modified time (auto) | auto | Shown on the status page. |

- **Primary key:** `Key`. **Foreign keys:** none.
- **Access rule:** the public can neither read nor write this table — the website reads it server-side with a token scoped to `data.records:read` on this one base, and the app contains no code path that writes to Airtable. Only the owner, and anyone they invite to the base, can see or edit it, inside Airtable, behind Airtable's own login.

**Seed data (this is the site's complete starting copy — the story paragraph is the draft the owner asked for):**

| Key | Section | Value | Max Length |
|---|---|---|---|
| `meta.title` | Meta | Ember & Oak — small-batch coffee roasters | 60 |
| `meta.description` | Meta | Small-batch coffee roasted before sunrise, twelve kilos at a time, and bagged the same morning. | 160 |
| `hero.eyebrow` | Hero | SMALL BATCH · ROASTED DAILY | 32 |
| `hero.headline` | Hero | Roasted before the sun is up. | 60 |
| `hero.subhead` | Hero | Twelve kilos at a time, in a dim room on the edge of town — bagged the same morning. | 140 |
| `hero.alt` | Hero | An Ember & Oak coffee bag standing on a dark oak counter, lit from the left by warm lamplight. | 160 |
| `hero.cue` | Hero | See the roasts | 24 |
| `roasts.title` | Roasts | Two ways to take it. | 48 |
| `roasts.intro` | Roasts | The same bag, filled two ways. Whatever's on the counter this week is listed here. | 200 |
| `film.title` | Film | Five seconds in the drum. | 48 |
| `film.caption` | Film | Green to dark, on the counter where it happens. | 120 |
| `film.description` | Film | A single green coffee bean rests on an oak counter with the Ember & Oak bag standing behind it. Over five seconds the bean darkens from pale green through tan to a deep, oily brown as warm light moves across it. | 400 |
| `story.title` | Story | Our story | 40 |
| `story.body` | Story | Ember & Oak started with a secondhand drum roaster, a cold garage and a stubborn idea: that coffee should taste like the morning it was roasted. We roast in small batches before the sun is properly up — twelve kilos at a time, by eye and by ear, listening for the crack. Every bag is filled the same day it comes off the drum. Nothing sits, nothing waits, nothing goes stale on a shelf. | 900 |
| `story.emphasis` | Story | listening for the crack | 80 |
| `contact.title` | Contact | Say hello. | 40 |
| `contact.note` | Contact | Wholesale, a bag for the office, or a question about a roast — this reaches us directly. | 200 |
| `contact.email` | Contact | thebag@power-in-numbers.net | 120 |
| `contact.copy_label` | Contact | Copy address | 24 |
| `footer.line` | Footer | Ember & Oak · Small-batch coffee roasters | 80 |
| `footer.social` | Footer | *(empty — the footer's social row stays hidden until filled)* | 300 |

### Table: Roast Profiles

The roast cards shown between the hero and the film.

| Field | Type | Required | Notes |
|---|---|---|---|
| `Name` | Single line text — **primary field, unique** | yes | ≤ 32 chars. |
| `Roast Level` | Single select: `Light`, `Medium`, `Dark` | yes | Shown as the card's chip. |
| `Origin` | Single line text | yes | ≤ 48 chars, e.g. "Huila, Colombia". |
| `Tasting Notes` | Single line text | yes | ≤ 60 chars. Rendered exactly as typed, including the `·` separators. |
| `Process` | Single select: `Washed`, `Natural`, `Honey`, `Wet-hulled`, `Anaerobic` | no | Row hidden on the card when empty. |
| `Altitude` | Single line text | no | ≤ 16 chars, e.g. "1,750 m". |
| `Batch Size` | Single line text | no | ≤ 16 chars, e.g. "12 kg". |
| `Image Slug` | Single line text | yes | Must be `roast-light` or `roast-dark`. Soft reference to the committed media set at `/media/{slug}-{width}.{ext}`; validated at boot and reported on `/status`. |
| `Image Alt` | Long text | yes | ≤ 160 chars. |
| `Sort Order` | Number (integer) | yes | Ascending. |
| `Published` | Checkbox | yes (default ✓) | Unticking it removes the card from the live site within 60 seconds — this is the owner's "pause" control. |

- **Primary key:** `Name`. **Foreign keys:** none (with two tables, an Airtable link field would add clicks and buy nothing; `Image Slug` is the documented soft reference).
- **Access rule:** identical to Page Content — read-only to the website via the scoped token, editable only by the owner inside Airtable. No visitor can write, and no signed-out stranger can submit anything anywhere in this app.

**Seed data:**

| Name | Roast Level | Origin | Tasting Notes | Process | Altitude | Batch Size | Image Slug | Sort Order | Published |
|---|---|---|---|---|---|---|---|---|---|
| Sunrise Light | Light | Huila, Colombia | Apricot · Honey · Bergamot | Washed | 1,750 m | 12 kg | `roast-light` | 10 | ✓ |
| Nightwood Dark | Dark | Gayo, Sumatra | Cocoa nib · Molasses · Cedar | Wet-hulled | 1,400 m | 12 kg | `roast-dark` | 20 | ✓ |
| Counterweight Medium | Medium | Antigua, Guatemala | Brown sugar · Orange peel · Almond | Washed | 1,600 m | 12 kg | `roast-light` | 30 | ✗ |

The third row ships unticked on purpose: it shows the owner exactly how to stage a roast before it goes live, and it proves the `Published` filter works.

**No owner login is seeded, because the app has none.** The owner's access to their data is their Airtable account on this base.

---

## 4. Screens

The app is one content page plus two utility routes. All three sit on the §2 tokens.

### Screen: The Page

**Route:** `GET /` · **Purpose:** the whole website — the one scroll that has to do the job.

**App shell (present on this screen and `/status`).**
- *Roast line* — signature moment 1, flush to the top edge of the header, `aria-hidden`.
- *Skip link* — "Skip to content", visually hidden until focused, then pinned top-left with the 2px ember focus ring.
- *Header* — sticky, `64px` tall (`72px` ≥1024px). Transparent over the hero; once `scrollY > 48`, background `rgba(11,10,9,.72)` with `backdrop-filter: blur(12px)` and a bottom hairline, cross-fading over `--dur-base`. Left: the coded oak-leaf-and-flame SVG mark (22px) + "EMBER & OAK" in Karla 600, `0.18em` tracking, `0.8125rem`. Right, ≥768px: text links `Roasts` · `In the drum` · `Story`, then the primary action **"Email us"** (ember fill `--accent-base`, `--accent-text-on-accent` label, `--radius-sm`, height 40px, padding `0 16px`). Below 768px the three links are hidden (the page is short and scrolling is the navigation) and only the mark and "Email us" remain, at a 44px hit height.
- *No command palette.* The Standards trigger one at 3+ app screens or global search; this app has a single content page (status and 404 are utility routes, not destinations) and nothing to search. The header's section nav takes its place and is fully keyboard operable.

**Section A — Hero.**
- `min-height: 88svh`, `max-height: 900px`. The hero photograph is a real `<img>` (never a CSS background, so it can be preloaded and given `fetchpriority="high"`), `object-fit: cover`, `srcset` at 640/1024/1600/2400w in AVIF → WebP → JPEG, `sizes="100vw"`, intrinsic `width`/`height` set so CLS is zero, `alt` = `hero.alt`.
- Coded scrim over it: `linear-gradient(180deg, rgba(11,10,9,.75) 0%, rgba(11,10,9,.25) 38%, rgba(11,10,9,.88) 100%)`, plus the drum-glow: `radial-gradient(60% 45% at 18% 88%, var(--accent-subtle-bg) 0%, transparent 70%)` at `opacity:.9`.
- Text block anchored bottom-left, `padding-bottom: var(--space-9)` (`--space-10` ≥1024px), headline `max-width: 16ch`: eyebrow (`--step-label`, `--text-muted`), headline (`--step-display-xl`, Fraunces, `--text-primary`), a 1px `--oak` rule `120px` wide, subhead (`--step-body-l`, `--text-secondary`, max `46ch`), then the scroll cue: `hero.cue` + Lucide `arrow-down` (20px), `--accent-text`, which smooth-scrolls to Section B and is a real `<a href="#roasts">`.
- Entrance: eyebrow → headline → rule → subhead → cue, 16px rise + fade, `240ms --ease-out`, `60ms` stagger, starting on the hero image's `load` event or after `300ms`, whichever comes first. Reduced motion: all five appear together in a `120ms` fade.
- **Loading:** before the hero image decodes, its container shows the LQIP (a 24px-wide blurred AVIF of the same frame, scaled up, `filter: blur(18px)`) at the exact 3:2 box, cross-fading to the full image over `280ms`. Never a spinner.
- **Error (image missing or failed):** the container falls back to the coded drum-glow panel at the same aspect ratio; the headline and subhead render on top unchanged, so the hero is still a hero. `/status` lists the missing file.

**Section B — Roasts** (`id="roasts"`).
- Section header: `roasts.title` (`--step-display-l`), `roasts.intro` (`--step-body-l`, `--text-secondary`, max `52ch`).
- Cards, sorted by `Sort Order` ascending, then `Name` A→Z, filtered to `Published = true`, capped at 4. Layout: 1 card → full width with the photo at 3:2; 2 cards → two columns ≥900px, stacked below; 3–4 cards → 2×2 grid ≥900px.
- Card anatomy: photograph in a counter-edge frame at 4:5 (`srcset` 640/1024/1600w, `alt` = `Image Alt`); beneath it `Name` (`--step-h3`, Fraunces); `Tasting Notes` in Fraunces **italic** `1.125rem`, `--text-secondary`; the roast-level chip (`--step-label`, 1px `--border-hairline`, `--text-muted`, `--radius-sm`, 24px tall — never ember, because ember is reserved for heat, not for labels); then the roast-log rows, each `label left / value right` with a `--border-hairline` divider and tabular figures: `ORIGIN`, `PROCESS`, `ALTITUDE`, `BATCH`. A row whose value is empty is omitted entirely, never shown as "—".
- Card states: the card is not a link and not clickable; its photograph scales `1.00 → 1.02` over `--dur-base` on hover of the card, clipped by the frame, disabled under reduced motion.
- **Loading:** each card renders a skeleton mirroring its real layout — a 4:5 tinted block at `--bg-raised`, a 60%-width title bar, a 40%-width notes bar, four 100%-width row bars — with a 1.4s shimmer sweep (`--accent-subtle-bg` at 6% opacity). Under reduced motion the shimmer is a static tint.
- **Empty (no published rows):** a centred block inside a `--bg-surface` panel with a hairline: Lucide `package-open` (32px, `--text-muted`), headline **"Nothing on the counter yet."** (`--step-h2`), guidance "Today's roasts appear here as soon as they're added to the sheet.", primary action **"Email us about this week's roast"** (ember fill, opens the mail client).
- **Error (roast data unreadable):** the same panel with headline **"The kettle's off."** and "We couldn't load the roast notes just now. Refresh in a moment, or email us at thebag@power-in-numbers.net." The rest of the page renders normally — one failed section never takes the page down.

**Section C — In the drum** (`id="film"`).
- `film.title` (`--step-display-l`), then the film in a counter-edge frame at 16:9, `max-width: 1100px`, centred.
- `<video muted playsinline preload="none" poster="/media/roast-clip-poster-1280.jpg">` with two `<source>` elements selected by `media`: `roast-clip-720.mp4` (1280×720) for `≥768px`, `roast-clip-480.mp4` (854×480) below. **Muted + `playsinline` are mandatory** — without both, iOS refuses inline autoplay and the frame flashes blank.
- Playback: an `IntersectionObserver` at `threshold: 0.5` calls `play()` the first time the frame is half visible, and `pause()` when it leaves. The clip does **not** loop — a green-to-dark transformation that snapped back would undo its own point. It plays once and holds its final frame; "Replay" seeks to 0 and plays again.
- Controls row beneath the frame, left-aligned: **Play / Pause** (Lucide `play` / `pause`, 24px, icon + visible text label, ghost button with hairline border), **Replay** (Lucide `rotate-ccw`, same treatment, disabled and `aria-disabled` until the clip has played once), then `film.caption` (`--step-caption`, `--text-muted`). All buttons: 44px hit height, hover lifts border to `--border-strong`, focus-visible shows the 2px `--accent-base` ring at 2px offset, pressed uses `--accent-pressed` on the border, disabled is `opacity:.45`, `cursor:not-allowed`, and genuinely inert.
- Below the controls, a disclosure: **"Describe this clip"** (Lucide `chevron-down`, rotates 180° over `--dur-fast`) expanding `film.description` in `--text-secondary`. The same text is attached to the video via `aria-describedby`, so screen readers get it whether or not the disclosure is open.
- **Autoplay blocked** (a browser refuses the promise): the poster stays, and a centred 56px circular play button in `--accent-base` with `--accent-text-on-accent` icon appears over it with a `--dur-base` fade. No error message — this is a normal state, not a fault.
- **Reduced motion:** never autoplays. Poster + the centred play button, always.
- **Loading:** the frame shows the poster's LQIP at 16:9 until the poster decodes; the video itself loads only when the frame is within 200px of the viewport (`preload="none"` until then).
- **Error (video files missing or both sources fail):** the frame shows the poster alone if present; if the poster is missing too, a coded ember-wash panel at 16:9 with **"We couldn't load the clip."** and "Refresh the page, or email us and we'll send it over." `/status` lists the missing files.

**Section D — Story** (`id="story"`).
- On `--bg-surface` with hairline top and bottom, full-bleed background, content constrained to `68ch`.
- `story.title` (`--step-display-l`), then `story.body` at `--step-body-l`, `--text-secondary`, `line-height 1.6`. The renderer wraps the **first exact occurrence** of `story.emphasis` in `<em>` (Fraunces italic, `--text-primary`); if the substring isn't found, nothing is italicised and nothing breaks. No HTML is ever accepted from Airtable — the emphasis mechanism exists precisely so the owner never needs to type a tag.
- **Empty / invalid:** the committed fallback paragraph is used, and `/status` warns. The section is never blank.

**Section E — Contact** (`id="contact"`).
- Centred, `--space-10` vertical padding. `contact.title` (`--step-display-l`), `contact.note` (`--step-body-l`, `--text-secondary`, max `52ch`).
- The address is the call to action: rendered at `--step-h2` in Karla 600 as an `<a>` whose visible text **and** `href` are HTML-entity encoded character by character (`&#116;&#104;&#101;…`), so browsers render and link it perfectly with no JavaScript while naive scrapers find no plain-text address anywhere in the served HTML. Ember underline: 1px `--accent-base`, thickening to 2px `--accent-hover` and dropping 2px on hover over `--dur-fast`; focus-visible shows the 2px ring.
- Beside it, **"Copy address"** (label from `contact.copy_label`) — ghost button, Lucide `copy` 20px, 44px hit height. On click: `navigator.clipboard.writeText()`, then a toast bottom-right, `--z-toast`, `--bg-raised` + hairline + `--success` 3px left edge, text **"Address copied. We read every one."**, entering with a 12px rise + fade over `--dur-base`, auto-dismissing at `4500ms`, dismissible with Esc or the toast's own close button, announced via `aria-live="polite"`, never more than one stacked. If the clipboard API is unavailable or rejects, the toast switches to `--warning` with **"Couldn't copy — the address is thebag@power-in-numbers.net."** The button is hidden entirely when JavaScript is off; the address link still works.

**Section F — Footer.**
- Hairline top. The mark + wordmark; `footer.line` (`--step-caption`, `--text-muted`); the privacy line, always present and never editable: **"This site sets no cookies, runs no trackers, and collects nothing about you."**; `© {current year} Ember & Oak.`; and a social row that renders only if `footer.social` is non-empty (comma-separated `Label|https://url` pairs), hidden otherwise. No ember anywhere in the footer.

**Page-wide details.** Dates are not shown on this screen. Numbers inside roast rows use tabular figures and comma thousands separators exactly as typed by the owner. `<title>` = `meta.title`; meta description, canonical, Open Graph and Twitter `summary_large_image` tags point at `/media/og-card.jpg` (1200×630, cropped from the hero master at build — not a separate generation). JSON-LD `Organization` with `name`, `email`, `url`, `logo`. Tab order: skip link → header mark → nav links → Email us → hero cue → (cards are not focusable) → Play/Pause → Replay → disclosure → address → Copy address → footer links. Esc closes the topmost layer (the toast, then the disclosure).

### Screen: Site Status

**Route:** `GET /status` · **Purpose:** the owner's plain-English answer to "is my edit live, and is everything still there?" Public, but it reveals nothing private — every value on it is already visible on the page or is a count.

- One `--bg-surface` panel, hairline, `max-width: 640px`, inside the same shell. Title **"Site status"** (`--step-h2`), subtitle "Edits you make in the sheet appear on the site within 60 seconds. Refresh this page to check."
- Rows, each `status dot (8px circle) · label left · value right (tabular)`:
  - **Content source** — `Live sheet` (dot `--success`) / `Saved copy` (dot `--warning`, means Airtable was briefly unreachable and the last good copy is showing) / `Built-in copy` (dot `--danger`, means Airtable hasn't answered since the site started).
  - **Last checked** — `12 Mar 2025 at 06:14 UTC` plus `(18s ago)`.
  - **Roast cards published** — `2 of 3`.
  - **Media files** — `4 of 4 present`, with any missing filename listed beneath in `--danger`.
  - **Warnings** — any §6 validation failure in plain English, e.g. "Your story is 1,024 characters — the page is showing the built-in copy until it's under 900." `--warning` dot; when there are none: "No warnings."
  - **Version** — the 7-character deploy id.
  - **Uptime** — `3d 04h 12m`.
- **Loading:** server-rendered, so the panel arrives complete; no skeleton needed. If a value is genuinely unknown it reads `—` with a `--text-muted` dot, never a blank.
- **Empty:** not possible — the panel always has all seven rows.
- **Error:** if the status check itself throws, the panel shows **"We can't read our own status."** / "The site itself may still be fine — open the front page to check. If it's down too, redeploy the last good version from your hosting dashboard."
- Footer link **"Back to the site"**.

### Screen: Page Not Found

**Route:** any unmatched path, `404` status · **Purpose:** send a lost visitor back in one tap.

- Full-height centred block on `--bg-base` with the drum-glow radial behind it. Lucide `coffee` (32px, `--text-muted`), headline **"That page went cold."** (`--step-display-l`), body "There's only one page here, and it's this way.", primary action **"Back to the roastery"** (ember fill → `/`).
- No search, no suggestions — there is nothing else to find. Header and footer render as normal so the wordmark is always a way home.
- Requests with `Accept: application/json` receive `{"error":"not_found"}` with status 404 instead of HTML.

---

## 5. User flows

**1. First visit, phone, slow connection (the flow that matters most).** Visitor taps the link → the server returns HTML built from cached content in well under 100ms → the preloaded hero AVIF and the two self-hosted `woff2` files are already in flight → at ~0.6s the LQIP blur and the headline are on screen with final metrics (no shift); at ~1.4s the hero image cross-fades in; the roast line sits at 0% in bean-green. The video has not been requested at all yet. Target LCP ≤ 2.0s on a simulated mid-tier phone over Fast 3G.

**2. Scrolling to the roasts.** Reveal animations fire once at 20% visibility; the roast line warms toward ember; the two cards' photographs load from `srcset` as they approach. Nothing is fetched from Airtable during this — the whole page came from one server-side read.

**3. Reaching the film.** The frame enters within 200px → the browser fetches the correct MP4 rendition → at 50% visibility playback starts muted and inline → five seconds later the bean is dark and the frame holds. Scroll past and it pauses; scroll back and it stays paused on its last frame until "Replay" is pressed. *Unhappy paths:* autoplay refused → poster + centred play button; reduced motion set → never autoplays, poster + play button; video files missing → poster alone, or the coded panel and the honest "We couldn't load the clip." copy; the visitor presses Play before the file is ready → the button shows an inline 16px spinner and is disabled until `canplay` fires.

**4. Making contact on a phone.** Tap the address → the OS mail composer opens with the address filled in → done. *Unhappy path:* on a desktop with no mail client, nothing appears to happen — which is why "Copy address" sits immediately beside it, and why the toast confirms the copy in words.

**5. Copying the address.** Click "Copy address" → clipboard write → success toast, auto-dismissing at 4.5s, announced politely to screen readers. *Unhappy path:* clipboard blocked (insecure context, permissions) → warning toast that spells the address out, so the visitor can still select it by hand.

**6. Keyboard-only visit.** Tab once → "Skip to content" appears with the ember ring → Enter jumps past the header → every subsequent stop shows the same visible ring → Enter activates links and buttons → Esc dismisses the toast, then collapses the disclosure. No focus trap exists anywhere because no modal exists anywhere.

**7. Owner edits the story.** Owner opens the Airtable base → edits `story.body` in the "Page copy" grid view → within 60 seconds the next visitor's page render picks it up; the owner refreshes and sees it. *Unhappy path:* the text is 1,024 characters → validation rejects **that one field only**, the page keeps showing the previous good text (or the built-in copy), and `/status` explains in one sentence what to fix. The rest of the edits still go live.

**8. Owner pauses a roast.** Owner unticks `Published` on "Nightwood Dark" → within 60 seconds the card disappears and the remaining card goes full-width → untick both and the designed empty state appears, not a blank gap.

**9. Airtable is down.** The scheduled refresh fails → three retries at 250ms, 1s, 3s → still failing → the site serves the last good cached content and `/status` reads "Saved copy". If the site restarts while Airtable is still down, it serves the committed built-in copy and `/status` reads "Built-in copy". **At no point does a visitor see an error page**; they see the site, with the most recent words available.

**10. A media file didn't deploy.** Boot-time check compares every expected media path against disk → missing files are recorded → the affected section renders its designed fallback → `/status` names the file. The page still sells coffee.

**11. Someone shares the link.** The Open Graph card (1200×630, cropped from the hero master) plus `meta.title` and `meta.description` render the preview on messaging apps and social platforms.

**12. Someone hits a URL that doesn't exist.** The 404 screen with "Back to the roastery".

---

## 6. Business logic & validation

**Content resolution (runs on every render, against the cache).** For each key: use the live Airtable value if it exists **and** passes validation → else the last good cached value → else the committed built-in default. Resolution is **per field**, never per page, so one bad field can never blank the site.

**Field validation and the exact owner-facing message on `/status`:**

| Rule | Failure message |
|---|---|
| `Value` must be non-empty after trimming | "`{Key}` is empty — the page is showing the built-in text." |
| `Value` length ≤ that row's `Max Length` | "Your `{Key}` is {n} characters — the page shows the built-in copy until it's under {max}." |
| `story.body` ≥ 120 characters | "Your story is very short ({n} characters) — the page shows the built-in copy until it's at least 120." |
| `contact.email` matches `^[^@\s]+@[^@\s]+\.[a-z]{2,}$` | "That contact address doesn't look like an email — the page is showing thebag@power-in-numbers.net." |
| `meta.description` 50–160 characters | "Your search description is {n} characters — search engines show about 160." *(warning only; the value is still used)* |
| `Key` matches `^[a-z]+\.[a-z_]+$` and is known to the app | *(silently ignored — unknown keys are not an error, so the owner can keep private notes as rows)* |
| No HTML is ever rendered from `Value`; all output is escaped | — |

**Roast card rules.**
- Show only `Published = true`. Sort by `Sort Order` ascending, then `Name` A→Z. Ties in `Sort Order` break on `Name`.
- `Image Slug` must be `roast-light` or `roast-dark` **and** the matching media set must exist on disk; otherwise the card is hidden and `/status` warns: "'{Name}' is hidden — its picture ({slug}) isn't in the site's files."
- `Tasting Notes` > 60 characters → the card is still shown, the notes truncated at the last whole word plus an ellipsis, and `/status` warns.
- More than 4 published cards → the first 4 by sort order are shown and `/status` warns: "You have {n} roasts published; the page shows the first 4."
- Optional rows (`Process`, `Altitude`, `Batch Size`) are omitted when empty.

**Cache logic.** In-memory, TTL `CONTENT_CACHE_TTL_SECONDS` (default 60), stale-while-revalidate 600s: a request arriving after expiry is served from stale cache immediately while one background refresh runs. **Single-flight** — only one Airtable request may be in flight at a time; concurrent renders share it. Retries: 3, at 250ms / 1s / 3s, only on 5xx, 429 and network errors. On 401/403 the app stops retrying, keeps serving fallback, and `/status` reads "Built-in copy — the sheet key was rejected."

**Email obfuscation.** The served HTML must never contain the literal string `thebag@power-in-numbers.net`. Both the anchor's text and its `href` are written as HTML numeric entities at render time (`&#109;&#97;&#105;&#108;&#116;&#111;&#58;` + the encoded address). Browsers decode both, so the link works with JavaScript disabled; naive scrapers harvesting raw text find nothing. The "Copy address" button decodes the same entities at click time.

**Scroll-progress calculation.** `progress = clamp(scrollY / max(1, documentHeight − viewportHeight), 0, 1)`; the roast line's width is `progress × 100%` and its gradient is sampled over the filled portion only. Recomputed on `scroll` and `resize`, throttled to one paint per frame.

**Rate limiting.** Per IP: 120 requests/minute to `/health`, 60/minute to `/api/content`, 300/minute to everything else. Over the limit → `429` with `Retry-After` and `{"error":"rate_limited","retryAfterSeconds":n}`; HTML requests get a plain 429 page reading "Too many requests just now. Try again in a minute."

**Permissions.**

| Action | Visitor | Owner |
|---|---|---|
| Read any page or public endpoint | ✅ | ✅ |
| Change any word, card or picture | ❌ (no mechanism exists) | ✅, in Airtable |
| Upload anything | ❌ | ❌ (media are committed at build) |
| Delete anything | ❌ | ✅, in Airtable |

**Not applicable to this app, stated so no one builds it by reflex:** account lifecycle (no accounts), password reset (no passwords), billing and refunds (no money changes hands), notification email (the app sends none), content moderation (nothing can be submitted), user management (there are no users).

---

## 7. API surface

No endpoint in this app requires authentication, because no endpoint exposes anything private and none of them writes.

| Method + path | Does | Request | Response | Auth | Errors |
|---|---|---|---|---|---|
| `GET /` | Server-renders the page from cached content | — | `200` HTML. `Cache-Control: public, max-age=0, s-maxage=60, stale-while-revalidate=600` | none | `500` HTML error screen with a request id |
| `GET /status` | Server-renders the status panel | — | `200` HTML. `Cache-Control: no-store` | none | `500` HTML with the "We can't read our own status." copy |
| `GET /health` | Liveness + content-source truth, for uptime monitors and the platform | — | `200 application/json`: `{"status":"ok"\|"degraded","contentSource":"airtable"\|"cache"\|"fallback","lastFetchedAt":"2025-03-12T06:14:02Z"\|null,"cacheAgeSeconds":18,"publishedRoasts":2,"missingMedia":[],"warnings":0,"version":"a1b2c3d","uptimeSeconds":273120}` | none | `503` `{"status":"error"}` only if the process cannot render at all. A `degraded` content source still returns **200**, so an Airtable blip never triggers a restart loop. |
| `GET /api/content` | The resolved page copy and roast cards as JSON — the same words already visible on the page; documented so the site stays portable | — | `200 application/json`: `{"source":"airtable","fetchedAt":"…","content":{"hero.headline":"…",…},"roasts":[{"name":"…","roastLevel":"Light","origin":"…","tastingNotes":"…","process":"…","altitude":"…","batchSize":"…","imageSlug":"roast-light","imageAlt":"…"}]}`. `Cache-Control: public, s-maxage=60` | none | `429`, `500` |
| `GET /media/*` | Static images, video renditions, poster, OG card | — | `200` with `Cache-Control: public, max-age=31536000, immutable` (filenames are content-hashed) | none | `404` |
| `GET /robots.txt` | Allows everything, points at the sitemap | — | `200 text/plain` | none | — |
| `GET /sitemap.xml` | One URL: the site root | — | `200 application/xml` | none | — |
| `GET /*` (unmatched) | 404 screen | — | `404` HTML, or `{"error":"not_found"}` for `Accept: application/json` | none | — |
| `POST`/`PUT`/`PATCH`/`DELETE` **any path** | — | — | `405` `{"error":"method_not_allowed"}` | — | The app implements **no** write endpoint; this is the blanket rejection. |

**Error envelope:** `{"error":"<code>","requestId":"<8-char id>"}` with codes `not_found`, `method_not_allowed`, `rate_limited`, `server_error`. The request id is logged with the stack trace to stdout; the body of a failing upstream response is never logged and never shown.

**Security headers on every response:** `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(), camera=(), microphone=(), interest-cohort=()`. The CSP is this strict because the site loads **no** third-party script, font, image or frame — self-hosted fonts and committed media are what make that possible.

---

## 8. Integrations & extras

### ACCEPTED — Higgsfield (build-time image and video generation, on the owner's own account)

**Why this provider, on capability.** The app needs three photoreal stills **and** five seconds of photoreal motion. Google AI Studio generates still images only, so it cannot make the film; Higgsfield covers stills and video in one connected account, so the owner connects one service and is billed on one account instead of two. That is the whole reason — not price, not habit.

**Connection shape.** Higgsfield is a **one-click connect**, not a pasted key: `HIGGSFIELD_CREDENTIALS` is a connected account the build tooling uses on the owner's behalf. It is **not** a runtime environment variable and must never appear in the deployed service's variable list (§10). Nothing is generated while a visitor is browsing — every asset is produced once, at build, and committed into the repository as a file.

**Model selection.** The build agent reads the live model catalogue at build time and picks the current best image model and the current best image-to-video model. No model id is named in this blueprint on purpose: a list frozen here goes stale the moment the vendor ships, and a stale id spends the owner's money on the wrong thing.

#### The Bag Sheet (canonical, committed at `assets/master/bag-spec.md`)

Every prompt embeds this verbatim. It is the single source of truth for what "the same bag" means:

- 340g (12oz) flat-bottom stand-up pouch, visible side gussets, standing upright.
- Body: matte charcoal-kraft laminate, colour `#2B2724`. **Matte** — no gloss, no plastic sheen, no reflected softbox.
- One horizontal ember-orange band (`#E2662B`), occupying the lower third, unbroken, letterpress-debossed.
- Wordmark **EMBER & OAK** centred on the band in condensed letterspaced capitals, warm off-white, one line, correctly spelled.
- A single oak-leaf-and-flame mark, ~26mm, centred above the wordmark, one consistent line weight, warm off-white.
- One 20mm matte-black one-way degassing valve, upper-right quadrant of the face.
- Roll-top closure folded twice, creased, with a copper tin-tie visible.
- Counter: dark oak, open grain, matte, no varnish highlights.
- Light: one warm key, low, from the left at ~30°; no fill, no rim, long soft shadow to the right.
- Permitted difference between variants: **only** a small kraft roast tag on the tin tie ("LIGHT" / "DARK") and the loose beans, props and lighting warmth. Bag artwork is identical in every asset.

#### The generation pipeline (this is the mechanism, run in this order)

1. **Master still.** Generate 4 candidates from the Bag Sheet at the highest supported resolution, 3:2. Score each against the 7-point check below; keep the best passing candidate. Commit it, uncropped, to `assets/master/master-bag.png` (kept out of the public directory) and write `assets/master/record.json` with the prompt, the model name used, the candidate index, the date and the acceptance notes.
2. **Hero.** Crop/frame the master to 3:2 for the hero; this is a crop of the accepted master, not a new generation, so the hero bag is definitionally the master bag.
3. **Light-roast still.** Image-to-image, **supplying `master-bag.png` as the reference image**, changing only camera angle (three-quarter, slightly higher), the loose beans in frame (pale, cinnamon-coloured) and the light temperature (a shade cooler, dawn-side). Run the 7-point check.
4. **Dark-roast still.** Same, reference image again supplied, with oily dark beans and a warmer, lower key. Run the 7-point check.
5. **Film source still.** A macro still generated from the same reference: one green coffee bean in sharp focus on the oak counter, the Ember & Oak bag standing behind it, out of focus but recognisable. 16:9.
6. **Film.** Image-to-video from step 5's still: the bean darkens from pale green through tan to a deep oily brown over five seconds as the warm key rakes across it. One continuous shot — no cut, no camera move beyond a slow push, no text, no people, no hands. Request 5s; accept 4–6s.
7. **Encode.** `ffmpeg` strips any audio track (`-an` — the clip ships silent by design) and produces `roast-clip-720.mp4` (1280×720, H.264 High, CRF 23, `-pix_fmt yuv420p`, `-movflags +faststart`, target ≤ 1.8 MB) and `roast-clip-480.mp4` (854×480, CRF 26, target ≤ 700 KB). If the returned clip is longer than 5.0s, trim to the **final** 5.0 seconds so the dark end state is never lost. The poster is extracted at `t=0` (the green bean, which invites the play) at 1280w as AVIF/WebP/JPEG.
8. **Derivatives.** `sharp` produces AVIF + WebP + JPEG at 640/1024/1600/2400w for the hero and 640/1024/1600w for each roast still, plus a 24px LQIP for each, plus `og-card.jpg` (1200×630, cropped from the master). Filenames are content-hashed.

#### The 7-point bag-consistency check (run per asset, recorded in `assets/master/acceptance.md`)

1. Flat-bottom pouch silhouette with visible gussets and a double-folded roll-top. 2. Matte charcoal-kraft body, no gloss. 3. One unbroken ember band across the lower third. 4. "EMBER & OAK" legible, correctly spelled, one line, centred on the band. 5. One oak-leaf-and-flame mark above it, single line weight. 6. One round matte-black valve, upper right. 7. Copper tin-tie visible at the roll top.

**Reject-and-regenerate rule.** Any asset failing one or more points is regenerated with the master supplied again and the failing point named explicitly in the prompt. After **3** failed attempts on one asset: for a still, the build agent falls back to a re-crop and re-light of the accepted master for that slot; for the film, it falls back to a tighter macro framing in which the bag is only an out-of-focus silhouette. Either substitution is written into `assets/master/acceptance.md` and surfaced to the owner at hand-off — never quietly.

**Known risk, stated plainly.** Generative models mangle small printed text. Point 4 is the gate that catches it: a still is shipped only if the wordmark is legible and correctly spelled. If three attempts fail on point 4, the master is regenerated with a larger, simpler band before any derivative is made.

**Failure behaviour at runtime:** none — there is no runtime. If a media file is absent from the deploy, §4's designed fallbacks render and `/status` names the file.

**Env vars:** none at runtime. `HIGGSFIELD_CREDENTIALS` is a connected account used at build time only.

**Three-way duty split**

- *Build agents:* read the live model catalogue; run the whole pipeline above; run the 7-point check on every asset; encode with `ffmpeg`; generate derivatives with `sharp`; commit media into `public/media/` and the regeneration kit into `assets/master/`; wire every asset into §4's markup with correct `srcset`, `sizes`, intrinsic dimensions and alt text.
- *Wired after deploy against the live URL:* nothing for Higgsfield (no webhook, no runtime key). The post-deploy check is simply: open the live URL, confirm all four assets render and `/status` reports "4 of 4 present".
- *Only the owner can do — **"Your part"** checklist:*
  1. Click **Connect** and sign in to Higgsfield (one click; there is no key to copy).
  2. Keep enough credit on that account for one generation run and the occasional regeneration.
  3. Look at the four finished assets and say yes or no. "No" means a re-run, not a rebuild.
  4. If your real packaging differs from the Bag Sheet, send one photo of it — the master is regenerated against that photo and everything else is re-derived from the new master.
  5. Accept the Airtable invite so you can edit your own words (free account).
  6. Optional: buy a domain and point it at the site (see §10), and set a free uptime monitor at `/health`.

### Airtable (the database, not an extra)

Created by the build: base **"Ember & Oak — Site Content"**, two tables per §3, with two owner-facing grid views ("Page copy", grouped by `Section`; "Roasts", sorted by `Sort Order`) and a "Start here" view whose `Notes` column explains each row in plain English. The app reads with a token scoped to `data.records:read` on this one base — **read-only**, so even a leaked token cannot change the site. Env vars in §10.

### SKIPPED extras and the consequence of each

- **Contact form + transactional email (Resend or similar)** — you chose a plain address, so messages land in your normal inbox and the site keeps no record of who wrote to you or when.
- **Online shop / checkout (Stripe)** — nobody can buy coffee from the page; every sale starts with an email or a visit.
- **Visitor analytics (Plausible or similar)** — you won't know how many people visit or how far they scroll. In exchange: no cookies, no banner, no tracker, and the strict CSP in §7 stays valid.
- **Map / address embed (Google Maps)** — no location is shown, so visitors can't find the roastery without asking. Adding it later means adding an address and relaxing `frame-src` in the CSP.
- **Newsletter signup** — no way to collect emails for roast announcements; repeat visitors have to remember you.
- **Audio on the film** — the clip is silent, so there's no roaster rumble or first-crack sound. (Silent is also what makes scroll-triggered autoplay acceptable on every browser.)
- **CDN in front of the site (Cloudflare, free)** — not needed at your traffic. **Ceiling, stated plainly:** one hosted web service comfortably serves this page's ~4 MB of media to thousands of visits a day; if a post goes viral, putting Cloudflare's free tier in front is a one-evening change and the only change needed.

---

## 9. Recommended stack

| Piece | Choice | Why |
|---|---|---|
| Framework | **Astro 5** with the Node adapter (standalone) | Server-renders one page and ships almost no JavaScript; islands cover the only three interactive bits (roast line, video controller, copy button). |
| Language | **TypeScript** | The Airtable shape is typed once and every template reads from it. |
| Styling | **Tailwind CSS**, themed entirely from `src/styles/tokens.css` | Delivers §2's token layer; a lint rule bans raw hex and px in components. |
| UI primitives | **Hand-built**, to the §4 state matrix | This page has three interactive elements and no dialog, menu or form control. Pulling in shadcn/Radix would add a dependency tree to style three buttons; the same states (hover, focus-visible, active, disabled, pressed) are specced in §4 and tested in §12. If a dialog or menu is ever added, add Radix then. |
| Icons | **Lucide** (`lucide-astro`, inlined SVG) | One family, 20px inline / 24px controls, stroke 1.75. |
| Fonts | **@fontsource-variable/fraunces**, **@fontsource-variable/karla** | Self-hosted, subset, preloaded — no render-blocking third-party font request, which is also what allows the strict CSP. |
| Images | **sharp** via Astro's image pipeline | AVIF/WebP/JPEG derivatives + LQIP at build; no runtime image service to pay for. |
| Video encode | **ffmpeg** at build | Two H.264 renditions, audio stripped, `faststart`, poster frame. |
| Data | **Airtable REST API** via `fetch` in one module, validated with **zod** | Nothing untyped or unvalidated ever reaches a template. |
| Hardening | Header + rate-limit middleware (helmet-equivalent, `express-rate-limit`-equivalent) | §7's headers and limits. |
| Testing | **Playwright** + **axe-core** + **Vitest** | §12 runs in CI on every push. |
| Charts | none | This app displays no quantitative series; a chart library would be dead weight. |
| Hosting | **Railway**, one web service, Node 20 | Binds `PORT`, restarts on crash, keeps previous deploys for one-click rollback. |

VibeStack Builder builds this on **GitHub + Railway + Airtable**, but nothing here is locked to that: the same repository runs on any Node host, and swapping Airtable for a committed JSON file is a matter of replacing one module (the fallback file already contains every default value).

---

## 10. Deployment

**One web service. No additional services** — nothing in this app runs between visits, so there is no worker and no scheduler to pay for.

1. Create the GitHub repository and push the build.
2. Create the Airtable base from §3 (two tables, the seed rows, the three views) and mint a **read-only** personal access token scoped to `data.records:read` on that base only.
3. Create one Railway service from the repo. Build: `npm ci && npm run build`. Start: `node ./dist/server/entry.mjs`. The server **must** bind `process.env.PORT` on host `0.0.0.0`.
4. Set the environment variables below.
5. Set the healthcheck path to **`/health`**.
6. Deploy. Then open the live URL and confirm: the hero renders, both roast cards render, the clip plays on scroll, the address opens a mail composer, and `/status` reads "Live sheet" with "4 of 4 present".
7. Optional domain: buy `emberandoak.com` (or similar) at any registrar, add it as a custom domain in Railway, and add the CNAME record Railway shows you. TLS is issued automatically. Until then the free `*.up.railway.app` URL works.
8. Optional: point a free uptime monitor (e.g. UptimeRobot) at `/health` every 5 minutes so you're emailed if the site stops answering.

**Complete environment-variable list**

| Variable | What it is for |
|---|---|
| `PORT` | Supplied by the host; the server binds to it. Never hard-code a port. |
| `HOST` | `0.0.0.0`, so the host can route traffic to the process. |
| `NODE_ENV` | `production` — enables compression and disables dev-only output. |
| `AIRTABLE_API_KEY` | The read-only personal access token for your content base. |
| `AIRTABLE_BASE_ID` | Which Airtable base to read. |
| `AIRTABLE_CONTENT_TABLE` | Table name for the page copy (default `Page Content`), so renaming a table in Airtable never breaks the site. |
| `AIRTABLE_ROASTS_TABLE` | Table name for the roast cards (default `Roast Profiles`). |
| `CONTENT_CACHE_TTL_SECONDS` | How long an Airtable read is reused before refreshing (default `60`). |
| `SITE_URL` | Your canonical address, used in the canonical tag, the sharing card and the sitemap. |

**Not an environment variable:** `HIGGSFIELD_CREDENTIALS`. It is a connected account used by the build tooling at generation time; the deployed service holds no image or video key at all, because every picture and the film are already files in the repository.

**Backups and recovery.** Every word has a committed fallback in the repo, so your copy cannot be lost even if the Airtable base is deleted; Airtable keeps its own record-level revision history for accidental edits; all media are in git. Recovery at 2am is: open Railway, pick the previous deploy, click redeploy — the site is back at the last known-good version in under a minute.

**Real monthly running cost, counting every service:** **Railway ~$5/mo — everything else is free at your size.** Airtable is free at this record count; there is no email service, no payment processor, no analytics and no CDN bill. Picture and film generation is a **one-off** charge on your own Higgsfield account at build time, not a monthly cost.

---

## 11. Owner/admin toolkit (recommended)

Each of these is a recommendation you can keep or trim.

- **Your content sheet — Airtable base with three ready-made views** *(recommended — keep or trim)*. A friendly spreadsheet holding your words and your roast cards, with a "Start here" view that explains every row in plain English. This is how you change the story, the tasting notes or your email address without ever touching code, and it is the app's always-required "see and manage your own data" tool. Trimming it means the words are fixed in the code and every change is a developer request.
- **Site status page (`/status`) — a simple health view** *(recommended — keep or trim)*. Tells you in one glance whether your latest edit is live, whether all four media files are present, and what needs fixing — in sentences, not error codes. Because the site is public, this is the public-facing app's health view.
- **Owner handbook (`README-for-owner.md` + a one-page printable)** *(recommended — keep or trim)*. Four short answers: how to edit a word, how to hide a roast, how to ask for a new photograph, and what to do if the site looks wrong. This is your first-run documentation and your support path — and since visitors' only support path is emailing you, it includes a suggested reply template for wholesale enquiries.
- **Media regeneration kit (`assets/master/`)** *(recommended — keep or trim)*. The accepted master bag image, the Bag Sheet, the exact prompts used, and the acceptance record. Any future photograph — a third roast, a seasonal bag — matches the bag you already have instead of starting a new-looking product. Trimming it means the next picture won't match.
- **Free uptime monitor pointed at `/health`** *(recommended — keep or trim)*. Emails you if the site stops answering, so you hear it from a robot rather than from a customer.
- **One-click roll-back (Railway's previous deploys)** *(recommended — keep or trim)*. If a change ever looks wrong, yesterday's site is one button away.

**Deliberately not built, because this app doesn't need them:** user management (there are no users), a revenue or sales view (no money changes hands here), content moderation queues (nothing can be submitted, by anyone, ever), and any admin screen behind a password (you asked for no logins, and your words are already protected by your Airtable account).

---

## 12. Test plan

Every specced behaviour has at least one check. Playwright drives Chromium and WebKit at 360×640 and 1440×900 unless stated.

**Content and data**
1. With seeded Airtable data, `/` renders all 22 content keys in their specced positions and both published roast cards, in `Sort Order` (Sunrise Light, then Nightwood Dark).
2. The unpublished "Counterweight Medium" row never appears in the HTML.
3. Unticking `Published` on both cards renders the empty state: "Nothing on the counter yet.", the guidance line, and the "Email us about this week's roast" button.
4. `story.body` at 1,024 characters → the page shows the built-in paragraph and `/status` shows the exact warning sentence from §6.
5. `contact.email` set to `not-an-email` → the page shows `thebag@power-in-numbers.net` and `/status` warns.
6. An unknown key row (`private.note`) is ignored and causes no error.
7. A roast row with `Image Slug = roast-medium` is hidden and `/status` names it.
8. `story.emphasis` present and found → wrapped in `<em>`; changed to a phrase not in the body → no italics, no error.
9. Airtable stubbed to return 500 → the page still renders from cache; `/status` reads "Saved copy"; `/health` returns **200** with `contentSource: "cache"`.
10. Airtable stubbed 500 from a cold start → page renders from the committed fallback; `/status` reads "Built-in copy"; `/health` returns 200, `status: "degraded"`.
11. Airtable stubbed 401 → no retry storm (exactly one attempt per TTL window), fallback served.

**Security**
12. The served HTML of `/` does **not** contain the literal string `thebag@power-in-numbers.net` anywhere; the address link still resolves to the correct `mailto:` when decoded by the browser, with JavaScript disabled.
13. Every response carries the §7 CSP, HSTS, nosniff, referrer and permissions headers; the page loads zero third-party requests (assert the network log contains only same-origin URLs).
14. `POST /`, `POST /api/content`, `DELETE /` all return `405`; no route anywhere writes to Airtable (static assertion: the Airtable module exports no write function).
15. Exceeding 60 requests/minute to `/api/content` returns `429` with `Retry-After`.
16. A forced 500 returns the error screen and a request id; the log line contains the id and no response body from Airtable.

**Media**
17. All four media sets exist at every specced width in AVIF, WebP and JPEG; the two MP4 renditions and the poster exist; `og-card.jpg` is 1200×630.
18. Deleting `roast-clip-720.mp4` → the film frame shows the poster with the centred play button; `/status` names the missing file; the page still returns 200.
19. Deleting the hero image set → the coded drum-glow panel renders at the same aspect ratio with the headline intact; CLS stays below 0.02.
20. The video element has `muted` and `playsinline` and does **not** have `loop`; it plays once on entering view and holds its last frame.
21. With autoplay blocked, the poster and play button appear and no error copy is shown.
22. Every `<img>` has non-empty, non-duplicated `alt` text drawn from its content field.

**Interaction and the state matrix**
23. Every interactive element — nav links, "Email us", the hero cue, Play/Pause, Replay, the disclosure, the address link, "Copy address", the toast's close button, "Back to the roastery" — shows a visible 2px `--accent-base` focus ring at 2px offset on keyboard focus, and none sets `outline: none` without a replacement.
24. "Replay" is disabled and inert before first playback (a click does nothing, `aria-disabled="true"`, `opacity .45`, `cursor: not-allowed`).
25. Hover, active/pressed and disabled styles differ measurably from default on every button.
26. Clicking "Copy address" writes the address to the clipboard and shows the success toast; the toast auto-dismisses between 4 and 6 seconds; Esc dismisses it early; only one toast is ever present.
27. With the clipboard API stubbed to reject, the warning toast spells the address out.

**Accessibility**
28. axe-core reports **zero** violations on `/`, `/status` and the 404 page at both viewports.
29. Full keyboard operability: Tab reaches every control in the §4 order; the skip link works; Enter activates links and buttons; Esc closes the toast then collapses the disclosure; no focus trap exists.
30. Every hit target is ≥40px, and the header's mobile controls are ≥44px.
31. Contrast: automated check of every token pairing used — body text ≥4.5:1, large text and UI ≥3:1. Specifically asserts `#E2662B` on `#0B0A09` ≥ 4.5 and `#14100D` on `#E2662B` ≥ 4.5.
32. The film's long description is reachable both via the disclosure and via `aria-describedby`; the toast region is `aria-live="polite"`.
33. Semantic structure: one `<h1>`, no skipped heading levels, landmarks (`header`, `main`, `footer`) present.

**Motion**
34. Section reveals run at 240ms ease-out with a 60ms stagger; hover transitions are ≤200ms; the poster→playback cross-fade is 280ms.
35. With `prefers-reduced-motion: reduce`: reveals become opacity-only fades, the roast-line tip glow is static, the card image hover-scale is disabled, and the video does not autoplay.
36. The roast line's filled width equals the scroll fraction within ±1% at 0%, 50% and 100% scroll, and its gradient stops match `--bean-green` → `--accent-base` → `--char`.

**Responsive and performance**
37. No horizontal overflow at 360px or 1440px on any of the three screens (assert `scrollWidth <= clientWidth`); the counter-edge extension never causes overflow on mobile.
38. Roast cards stack below 900px and sit two-across above it; the header's section links are hidden below 768px.
39. Hero AVIF at 1600w ≤ 180 KB; first-view weight excluding the video ≤ 1.1 MB; LCP ≤ 2.0s on a simulated mid-tier mobile over Fast 3G; CLS < 0.02; the video is not requested until its frame is within 200px of the viewport.
40. Fonts load from the same origin with `font-display: swap` and adjusted fallback metrics; no visible reflow on font swap.

**Endpoints**
41. `/health` returns the exact §7 JSON shape with all nine keys; it returns 200 (not 503) when the content source is `cache` or `fallback`.
42. `/api/content` returns the resolved content and roasts, and its `source` matches `/health`'s `contentSource`.
43. `/robots.txt` and `/sitemap.xml` are served and the sitemap contains `SITE_URL`.
44. An unknown path returns the 404 screen with "That page went cold." and HTTP 404; the same path with `Accept: application/json` returns `{"error":"not_found"}`.
45. Media responses carry `Cache-Control: public, max-age=31536000, immutable`; `/` carries `s-maxage=60`; `/status` carries `no-store`.

**Brief fidelity (a design failure is a fix cycle, same as a broken endpoint)**
46. `src/styles/tokens.css` contains every token named in §2 with exactly the specced values.
47. No raw hex colour and no raw px length appears in any `.astro`, `.ts` or `.tsx` component (lint rule; spacing must come from the 4px scale tokens).
48. Signature moment 1 exists and behaves: the roast line is present, pinned to the header's top edge, `aria-hidden`, tracks scroll, and carries the three-stop gradient.
49. Signature moment 2 exists: all four media frames have `14px 14px 0 0` radii and an oak hairline that extends beyond the frame.
50. Voice check: the four §2 strings appear verbatim in their specced places (empty state, copy toast, content error, 404).
51. Only two font families are loaded; Fraunces is used for display and the story emphasis only, Karla everywhere else; all numeric values render with tabular figures.
52. Ember coverage: on a full-page screenshot of `/`, pixels matching the accent ramp outside the photographs occupy less than 10% of the viewport at 1440×900.

**Release process**
53. CI runs build + Vitest + Playwright + axe on every push; a red check blocks deploy. Railway keeps the previous deploy for one-click rollback, and the rollback is exercised once during hand-off so the owner has done it before they need it.

<!-- stackbuilder:requires_auth=false -->

<!-- stackbuilder:public_tables=(none) -->

<!-- stackbuilder:public_write_tables=(none) -->

<!-- stackbuilder:platform_target=web -->
