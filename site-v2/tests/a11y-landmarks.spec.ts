import { test, expect } from '@playwright/test';
const ROUTES = ['/', '/roadmap', '/pricing'];
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 375, height: 812 }
];
test.describe('Accessibility - Landmarks & Headings', () => {
  for (const route of ROUTES) {
    test.describe(route, () => {
      for (const vp of VIEWPORTS) {
        test(`has exactly one main on ${vp.name}`, async ({ page }) => {
          await page.setViewportSize(vp);
          await page.goto(route);
          await page.waitForLoadState('networkidle');
          await expect(page.locator('main')).toHaveCount(1);
        });
        test(`has exactly one visible h1 on ${vp.name}`, async ({ page }) => {
          await page.setViewportSize(vp);
          await page.goto(route);
          await page.waitForLoadState('networkidle');
          await expect(page.locator('h1:visible')).toHaveCount(1);
        });
        test(`heading hierarchy has no skipped levels on ${vp.name}`, async ({ page }) => {
          await page.setViewportSize(vp);
          await page.goto(route);
          await page.waitForLoadState('networkidle');
          const levels = await page.evaluate(() => {
            const hs = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            return Array.from(hs).map(h => parseInt(h.tagName[1]));
          });
          for (let i = 1; i < levels.length; i++) {
            expect(levels[i] - levels[i-1]).toBeLessThanOrEqual(1);
          }
        });
        test(`has nav and footer landmarks on ${vp.name}`, async ({ page }) => {
          await page.setViewportSize(vp);
          await page.goto(route);
          await page.waitForLoadState('networkidle');
          await expect(page.locator('nav[aria-label]')).toBeVisible();
          await expect(page.locator('footer')).toBeVisible();
        });
      }
    });
  }
});