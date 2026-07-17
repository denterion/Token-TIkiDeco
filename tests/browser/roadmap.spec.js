import { test, expect } from '@playwright/test';
test.describe('Public Roadmap', () => {
  test('loads without errors', async ({ page }) => {
    await page.goto('/roadmap');
    await expect(page.locator('h1')).toBeVisible();
  });
  test('displays roadmap items', async ({ page }) => {
    await page.goto('/roadmap');
    const items = page.locator('[data-testid="roadmap-item"]');
    await expect(items.first()).toBeVisible({ timeout: 10000 });
  });
});