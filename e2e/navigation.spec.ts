import { test, expect } from '@playwright/test';

test.describe('Main navigation', () => {
  test('shows logged-out links and hides authenticated-only links', async ({
    page,
  }) => {
    await page.goto('/home');
    const nav = page.getByRole('navigation', { name: 'main' });

    await expect(nav.getByRole('link', { name: 'Featured' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Sign Up' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Login' })).toBeVisible();

    await expect(nav.getByRole('link', { name: 'Following' })).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'My Page' })).toHaveCount(0);
  });

  test('clicking Featured navigates to the featured page', async ({
    page,
  }) => {
    await page.goto('/home');
    const nav = page.getByRole('navigation', { name: 'main' });

    await nav.getByRole('link', { name: 'Featured' }).click();

    await expect(page).toHaveURL(/\/featured$/);
    await expect(
      page.getByRole('heading', { name: 'Featured', exact: true })
    ).toBeVisible();
  });
});
