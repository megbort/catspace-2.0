import { test, expect } from '@playwright/test';

test.describe('Route guards', () => {
  test('unauthenticated visit to /following redirects to /home', async ({
    page,
  }) => {
    await page.goto('/following');
    await expect(page).toHaveURL(/\/home$/);
  });

  test('unauthenticated visit to /profile/me redirects to /home', async ({
    page,
  }) => {
    await page.goto('/profile/me');
    await expect(page).toHaveURL(/\/home$/);
  });
});
