import { defineConfig } from '@playwright/test';

/**
 * §12 e2e/axe suite. The server boots in production mode with dummy Airtable
 * credentials: content resolution falls back to the committed copy (§6 —
 * a designed state, not a failure), while media renders from the repo's
 * committed masters via the build-time pipeline.
 *
 * PLAYWRIGHT_CHROMIUM_PATH lets a sandbox point at a self-supplied Chromium;
 * CI installs the standard browser and leaves it unset.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  webServer: {
    command: 'node ./dist/server/entry.mjs',
    port: 4321,
    reuseExistingServer: false,
    timeout: 30_000,
    env: {
      NODE_ENV: 'production',
      HOST: '0.0.0.0',
      PORT: '4321',
      SITE_URL: 'http://localhost:4321',
      AIRTABLE_API_KEY: 'ci-dummy-key',
      AIRTABLE_BASE_ID: 'ci-dummy-base',
    },
  },
});
