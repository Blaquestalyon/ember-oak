# Acceptance record — bag-consistency checks (blueprint §8)

Model used: `nano_banana_pro` (Nano Banana Pro, 2K), chosen from the live
Higgsfield catalogue as the current best image model with reference-image
support (image_references role) — required for steps 3–5.

## Master still

Four candidates generated at 3:2, 2K, from the Bag Sheet:

| Candidate | Job id | 7-point result |
|---|---|---|
| 1 | 5b6cd441-3b57-4c40-a3af-a1b8dac85908 | PASS 1,2,3,4,5,7 · point 6 partial (valve upper-centre, not clearly upper-right) |
| 2 | 39ad8bbb-f4d7-48ef-8215-1c339ee70bd9 | PASS all 7 · but extra printing "340g (12oz)" violates the Bag Sheet ("no other printing") |
| 3 | 4a58b1ee-7220-4cb6-94f7-53d4276deb46 | **ACCEPTED** — PASS 1,2,3,4,5,7 · point 6 partial (valve upper-centre-right of the face at the ¾ angle) |
| 4 | 617b23f0-06fb-47ff-9926-998ef151519b | PASS all 7 · but extra printing "340g (12oz)" violates the Bag Sheet |

**Accepted: candidate 3** (`assets/master/candidates/master-candidate-3.png`,
job `4a58b1ee-7220-4cb6-94f7-53d4276deb46`). Reasons: only candidates 1 and 3
carry no printing beyond the wordmark and mark (Bag Sheet rule); 3 has the
clearest gussets, double-folded roll-top and copper tin-tie, and its ¾ angle
gives the hero its depth. Noted deviation: the degassing valve sits
upper-centre-right rather than hard upper-right; recorded here rather than
re-rolled because every derived asset inherits the same placement, which is
what "the same bag" protects.

## Derived stills (reference image = accepted master, job id above)

| Asset | Job id | 7-point result |
|---|---|---|
| Light-roast still (4:5) | 56c9a874-eea4-4dfa-bc76-64ca64089c7b | PASS — same bag; only permitted differences (kraft "LIGHT" tag on tin-tie, pale cinnamon beans, cooler dawn-side key) |
| Dark-roast still (4:5) | be532fd2-1332-4c52-af05-9344da280f2b | PASS — same bag; only permitted differences (kraft "DARK" tag, oily dark beans, warmer lower key) |
| Film source still (16:9) | a72afb82-8650-4363-a331-060aa30d856a | PASS — one green bean sharp on the oak counter, the bag out of focus but recognisable behind |

## Film

The build tooling's video channel failed its cost preflight twice (no job was
created — confirmed against the owner's account activity). Per the platform's
guidance the owner generates the clip on their own Higgsfield account from the
accepted film-source still and uploads it to `assets/master/roast-clip-raw.mp4`;
the build pipeline then encodes the §8 renditions with ffmpeg. Recorded here so
the substitution of *who ran the generation* is never quiet. The clip content
and acceptance criteria are unchanged from §8.

## Substitutions

None. No asset needed the 3-attempt fallback.
