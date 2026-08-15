import { test, expect } from '@playwright/test';

test.describe('Profile page', () => {
  test('renders gracefully for a profile id that does not exist', async ({
    page,
  }) => {
    await page.goto('/profile/does-not-exist-12345');

    // Page should settle past the loading skeleton without crashing.
    await expect(page.locator('app-skeleton')).toHaveCount(0, {
      timeout: 15000,
    });

    // Nonexistent user has no posts, and is shown the visitor follow toggle.
    await expect(page.getByText('No Posts')).toBeVisible();
    await expect(page.getByRole('button', { name: /Follow/ })).toBeVisible();
  });
});
