import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Sign Up opens the signup dialog with expected fields', async ({
    page,
  }) => {
    await page.goto('/home');
    const nav = page.getByRole('navigation', { name: 'main' });

    await nav.getByRole('button', { name: 'Sign Up' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('input[formcontrolname="name"]')).toBeVisible();
    await expect(
      dialog.locator('input[formcontrolname="handle"]')
    ).toBeVisible();
  });

  test('Login with demo credentials authenticates and updates the nav', async ({
    page,
  }) => {
    await page.goto('/home');
    const nav = page.getByRole('navigation', { name: 'main' });

    await nav.getByRole('button', { name: 'Login' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    // The login form is pre-filled with a demo account for exactly this purpose.
    await expect(dialog.locator('input[formcontrolname="email"]')).toHaveValue(
      'demo3@example.com'
    );

    await dialog.getByRole('button', { name: 'Login', exact: true }).click();

    await expect(dialog).not.toBeVisible();
    await expect(nav.getByRole('link', { name: 'Following' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'My Page' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Login' })).toHaveCount(0);
  });
});
