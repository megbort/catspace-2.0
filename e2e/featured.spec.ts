import { test, expect } from '@playwright/test';

test.describe('Featured page', () => {
  test('renders the featured profiles grid', async ({ page }) => {
    await page.goto('/featured');

    await expect(
      page.getByRole('heading', { name: 'Featured', exact: true })
    ).toBeVisible();

    // Data comes from live Firestore, so don't assert an exact profile
    // count — just confirm the skeleton loaders resolve without crashing.
    await expect(page.locator('app-skeleton')).toHaveCount(0, {
      timeout: 15000,
    });
  });
});
