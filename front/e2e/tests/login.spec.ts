import { expect, test } from '@playwright/test';

import { baseURL } from '../playwright.config';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          email: 'test@example.com',
        }),
      });
    });
  });

  test('should successfully log in with email and password', async ({
    page,
  }) => {
    await page.goto(baseURL);

    await page.getByRole('button', { name: 'Login' }).click();

    const loginModal = page.getByRole('dialog', { name: 'Login' });
    await expect(loginModal).toBeVisible();

    await page
      .getByRole('textbox', { name: /email/i })
      .fill('playwright@test.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(loginModal).not.toBeVisible();

    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();

    await userMenu.click();
    await expect(page.getByText('playwright@test.com')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({
    page,
  }) => {
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid credentials',
        }),
      });
    });

    await page.goto(baseURL);

    await page.getByRole('button', { name: 'Login' }).click();

    await page
      .getByRole('textbox', { name: 'Email' })
      .fill('wrong@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByText('Invalid login. Please try again.')
    ).toBeVisible();
  });
});
