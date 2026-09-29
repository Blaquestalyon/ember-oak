/**
 * §12 e2e checks that run on every push (test 53): axe accessibility scans on
 * all three screens at both specced viewports, plus the security and voice
 * assertions that need a real browser.
 */
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const VIEWPORTS = [
  { name: 'mobile', width: 360, height: 640 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'status', path: '/status' },
  { name: 'not-found', path: '/definitely-not-a-page' },
] as const;

async function scan(page: Page) {
  return new AxeBuilder({ page })
    // The roast clip is silent by design (§8: audio stripped with -an), so
    // WCAG's captions requirement does not apply; axe's video-caption rule
    // cannot detect silence and would flag a false positive.
    .disableRules(['video-caption'])
    .analyze();
}

for (const viewport of VIEWPORTS) {
  for (const route of ROUTES) {
    test(`axe: zero violations on ${route.name} at ${viewport.name} (test 28)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      const results = await scan(page);
      expect(
        results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`)
      ).toEqual([]);
    });
  }
}

test('the served HTML of / never contains the literal address (test 12)', async ({ request }) => {
  const res = await request.get('/');
  expect(res.status()).toBe(200);
  const html = await res.text();
  expect(html).not.toContain('thebag@power-in-numbers.net');
  // The entity-encoded mailto prefix must be present instead.
  expect(html).toContain('&#109;&#97;&#105;&#108;&#116;&#111;&#58;');
});

test('security headers on every response (test 13)', async ({ request }) => {
  const res = await request.get('/');
  expect(res.headers()['content-security-policy']).toContain("default-src 'self'");
  expect(res.headers()['strict-transport-security']).toContain('max-age=31536000');
  expect(res.headers()['x-content-type-options']).toBe('nosniff');
  expect(res.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(res.headers()['permissions-policy']).toContain('geolocation=()');
});

test('writes are rejected with 405 (test 14)', async ({ request }) => {
  for (const path of ['/', '/api/content']) {
    const res = await request.post(path, { data: {} });
    expect(res.status(), `POST ${path}`).toBe(405);
  }
});

test('voice strings render verbatim in their places (test 50)', async ({ page }) => {
  await page.goto('/definitely-not-a-page');
  await expect(page.getByText('That page went cold.')).toBeVisible();
  await expect(page.getByText('Back to the roastery')).toBeVisible();

  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Roasted before the sun is up.');
});

test('the video element is muted, playsinline, and never loops (test 20)', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('video');
  if ((await video.count()) === 0) test.skip(true, 'media not generated in this tree');
  await expect(video).toHaveAttribute('muted', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).not.toHaveAttribute('loop', /.*/);
});

test('one h1, landmarks present (test 33)', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('header')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
});

test('no horizontal overflow at 360 and 1440 (test 37)', async ({ page }) => {
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: width < 700 ? 640 : 900 });
    for (const route of ROUTES) {
      await page.goto(route.path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth, `${route.path} @ ${width}`).toBeLessThanOrEqual(clientWidth);
    }
  }
});
