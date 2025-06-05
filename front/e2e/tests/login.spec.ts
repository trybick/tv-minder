import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';
import { password, username } from '../shared';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          email: username,
        }),
      });
    });
  });

  test('should successfully log in with email and password', async ({
    page,
  }) => {
    await page.goto(baseUrl);

    await page.getByRole('button', { name: 'Login' }).click();

    const loginModal = page.getByRole('dialog', { name: 'Login' });
    await expect(loginModal).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill(username);
    await page.getByRole('textbox', { name: /password/i }).fill(password);

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(loginModal).not.toBeVisible();

    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();

    await userMenu.click();
    await expect(page.getByText(username)).toBeVisible();
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

    await page.goto(baseUrl);

    await page.getByRole('button', { name: 'Login' }).click();

    await page
      .getByRole('textbox', { name: /email/i })
      .fill('wrong@example.com');
    await page
      .getByRole('textbox', { name: /password/i })
      .fill('wrongpassword');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(
      page.getByText('Invalid login. Please try again.')
    ).toBeVisible();
  });
});
