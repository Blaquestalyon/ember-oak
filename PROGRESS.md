# PROGRESS

## Done
- Airtable base created and fully seeded (owner confirmed 21 content rows; 3 roasts).
- Foundation, all five sections, status + 404 pages: built, integrated, verified.
- Media: four masters generated on the owner's Higgsfield (acceptance in
  assets/master/), raw clip supplied by the owner; build-time pipeline produces
  derivatives + film renditions (ffmpeg via railpack.json buildAptPackages —
  Railway's builder is Railpack and ignores nixpacks.toml, which stays for
  portability to Nixpacks hosts).
- DEPLOYED AND VERIFIED LIVE at https://ember-oak-production.up.railway.app:
  health ok, contentSource airtable, 2 roasts published, 4 of 4 media present,
  hero/cards/notes/emphasis/status/404/robots/sitemap all confirmed on the
  real address, address entity-encoded (no literal email in served HTML).
- Unit tests (21) for validation, obfuscation, rate limiting — all green.

## In progress
- Wiring phase: review question with the owner next, then the design loop,
  then the handoff.

## Next
- Review question (free text; act on anything missing; held_request for new asks).
- Design loop: bar author → 1 builder + 3 fresh critics × 3 rounds → owner
  accept-or-continue. Push after each 3-round pass (tree must build first —
  pushes redeploy the live site).
- Handoff: report_progress milestone with handoff_md (live URL, Airtable base
  appuuOpZoIhlCeRvs, repo Blaquestalyon/ember-oak, costs ~$5/mo Railway,
  no logins — owner edits words in Airtable; rollback via Railway deploys).
