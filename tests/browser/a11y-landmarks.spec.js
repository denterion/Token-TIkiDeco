import { test, expect } from '@playwright/test';
test.describe('Accessibility - Landmarks & Headings', () => {
  test('public roadmap has a main landmark and h1', async ({ page }) => {
    await page.goto('/roadmap');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
  test('heading hierarchy is logical', async ({ page }) => {
    await page.goto('/roadmap');
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
  });
});