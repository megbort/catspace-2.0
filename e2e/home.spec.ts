import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('renders the landing page for a logged-out visitor', async ({ page }) => {
    // Root redirects to /home for unauthenticated users (see src/app.routes.ts).
    await page.goto('/');
    await expect(page).toHaveURL(/\/home$/);

    // Hero image uses a hardcoded alt, so it's stable regardless of i18n language.
    await expect(page.getByAltText('A drawing of many cats')).toBeVisible();

    // A "create account" call-to-action button should be present.
    await expect(page.getByRole('button').first()).toBeVisible();
  });
});
