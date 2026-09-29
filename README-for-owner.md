# Your Ember & Oak website — the owner's handbook

Your website: **https://ember-oak-production.up.railway.app**
Your words live in: **Airtable → "Ember & Oak — Site Content"**
Your health check: **https://ember-oak-production.up.railway.app/status**

Four answers, then a spare reply for wholesale emails.

---

## 1. How do I change a word on the site?

1. Open airtable.com and sign in.
2. Open the base **Ember & Oak — Site Content** → the **Page Content** tab.
3. Find the row for the text you want (the **Notes** column tells you where each
   one appears) and edit the **Value** cell.
4. Wait up to a minute, then refresh your site. Done.

If an edit doesn't show up, open **/status** on your site — it will tell you in
a sentence what to fix (usually the text is longer than that row's limit).

## 2. How do I hide or add a roast?

- **Hide:** in the **Roast Profiles** tab, untick **Published** on that row.
  The card disappears from the site within a minute.
- **Show / add:** tick **Published** (or add a new row and tick it). A new row
  needs: Name, Roast Level, Origin, Tasting Notes, an **Image Slug** of exactly
  `roast-light` or `roast-dark` (that picks which photograph the card uses),
  Image Alt (a one-line description of the photo), and a Sort Order number
  (lower numbers appear first).
- The site shows at most 4 published roasts.

## 3. How do I get a new photograph or film?

The pictures are generated, not photographed — and the recipe that keeps every
picture looking like the same bag lives in your website's files, in the folder
called `assets/master` (the bag's written description, the accepted master
image, the exact prompts, and the acceptance notes).

Ask for a change through VibeStack Builder and say what you want in plain words
("a third roast photo with a MEDIUM tag", "a new seasonal bag"). If your real
packaging exists now, send one photo of it — everything gets re-derived to
match the real thing.

## 4. The site looks wrong — what do I do?

1. Open **/status** on your site. It answers most questions in plain sentences:
   whether your latest edit is live, whether all four picture/film sets are
   present, and any warnings about your text.
2. If the site itself is down: sign in to railway.com, open the **ember-oak**
   project, open the service's **Deployments** list, pick the previous
   deployment that worked, and choose **Redeploy**. The site is back at the
   last good version in under a minute.
3. Anything else: ask through VibeStack Builder.

---

## A spare reply for wholesale enquiries

> Hi —
>
> Thanks for getting in touch about wholesale. We roast in small batches
> (twelve kilos at a time) before sunrise and bag the same morning, so we like
> to start by understanding your volume and how often you'd want delivery.
>
> Could you tell me roughly how many bags a week you're thinking of, whether
> you want whole bean or ground, and where you are? I'll come back with
> options and a tasting box.
>
> — Ember & Oak

---

*Small print for future developers: the plan for this site is `blueprint.md`,
the reasons behind decisions are `decisions.md`, and `CLAUDE.md` tells any AI
agent how to work here. The site reads Airtable with a read-only key — nothing
on the internet can ever write to your sheet.*
