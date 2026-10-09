import { test, expect } from '@playwright/test';

test.describe('Not found page', () => {
  test('renders for an unknown route with links back into the app', async ({
    page,
  }) => {
    await page.goto('/this-page-does-not-exist');

    await expect(
      page.getByRole('heading', { level: 1, name: 'This page wandered off' })
    ).toBeVisible();
    await expect(page).toHaveTitle('Page not found | Catspace');

    const main = page.getByRole('main');
    await main.getByRole('link', { name: 'See featured cats' }).click();
    await expect(page).toHaveURL(/\/featured$/);
  });
});
