import { defineConfig } from 'vitest/config';

/**
 * Vitest owns tests/*.test.ts (unit). tests/e2e/ belongs to Playwright
 * (playwright.config.ts) — its spec files call Playwright's test(), which
 * Vitest must never try to host.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
});
