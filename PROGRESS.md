# PROGRESS

## Done — QA FIX ROUND APPLIED (on the delivered, owner-accepted build)
- Fixed /health source truth: failure now recorded only when a refresh COMPLETES
  and fails (lastFailureAt); an in-flight stale-while-revalidate pass no longer
  reads "degraded"/"cache" on a healthy system (decisions 17).
- CI shipped (§12 test 53): playwright.config.ts + tests/e2e/site.spec.ts (12 axe
  scans + security/voice/overflow checks; 13/13 green locally against the prod
  server) + workflow. PUSH CONSTRAINT: the push channel 403s on
  .github/workflows/* (no workflow token scope) — workflow staged at
  docs/ci-workflow.yml for the owner to copy into place via the GitHub editor;
  Railway's "wait for CI" check-suites toggle is the deploy-blocking switch
  (owner dashboard). decisions 18.
- Media pipeline now prefers the §8-canonical assets/master/master-bag.png
  (falls back to candidates/master-candidate-3.png). The canonical file itself
  is owner-uploaded (pixels live only in the repo). decisions 19.
- Earlier QA items re-checked against the recorded push history + live checks:
  index/status/404/layout/components, bag-spec.md, acceptance.md,
  README-for-owner.md were all pushed in recorded commits and render on the
  live site (verify_live passed hero/status/404/voice); nothing to change.
- Full local gate before push: clean build, token lint, 21 unit tests,
  13 e2e/axe tests — all green.

## In progress
- Owner steps for QA closure: copy docs/ci-workflow.yml → .github/workflows/ci.yml;
  upload master-bag.png; (optional, recommended) flip Railway's wait-for-CI toggle.

## Next
- After owner steps: verify_live re-run; confirm CI runs green on the next push.
