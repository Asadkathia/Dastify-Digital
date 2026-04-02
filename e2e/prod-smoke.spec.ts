import { test, expect } from '@playwright/test';

const BASE_URL = 'https://dastify-digital.vercel.app';

test.describe('Production smoke', () => {
  test('homepage renders key content and no fatal console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Dastify/i);
    await expect(page.getByText(/Book Free Audit/i).first()).toBeVisible();
    await expect(page.getByText(/Get Free Growth Audit/i).first()).toBeVisible();

    const images = page.locator('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(3);

    // Validate that declared image URLs are reachable (handles lazy-loaded offscreen images).
    const imageUrls = await page.evaluate(() =>
      Array.from(document.images)
        .map((img) => img.currentSrc || img.src)
        .filter(Boolean),
    );
    const uniqueImageUrls = [...new Set(imageUrls)];
    const brokenByStatus: string[] = [];
    for (const url of uniqueImageUrls) {
      const res = await page.request.get(url);
      if (!res.ok()) {
        brokenByStatus.push(`${url} -> ${res.status()}`);
      }
    }
    expect(brokenByStatus, `Broken image responses: ${brokenByStatus.join(', ')}`).toEqual([]);

    const severeErrors = consoleErrors.filter((e) => !/Failed to load resource: the server responded with a status of 404/.test(e));
    expect(severeErrors, `Console errors: ${JSON.stringify(severeErrors, null, 2)}`).toEqual([]);
  });

  test('admin login page is reachable', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    await expect(page.locator('body')).toContainText(/Log in|Email|Password/i);
  });

  test('api endpoints return expected status codes', async ({ request }) => {
    const me = await request.get(`${BASE_URL}/api/users/me`);
    expect(me.status()).toBe(200);

    const preview = await request.get(`${BASE_URL}/api/preview?slug=%2F`);
    expect(preview.status()).toBe(401);
  });
});
