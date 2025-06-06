import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';
import { password, username } from '../shared';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login
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

    // Mock change password API
    await page.route('**/api/settings/password', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Password changed successfully',
        }),
      });
    });
  });

  test('should change password successfully', async ({ page }) => {
    // Login first
    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: /email/i }).fill(username);
    await page.getByRole('textbox', { name: /password/i }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Go to settings page
    await page.goto(`${baseUrl}/settings`);

    await expect(page).toHaveTitle('Settings | TV Minder');

    // Click on change password section
    await page.getByRole('button', { name: /change password/i }).click();

    // Fill in password form
    await page
      .getByRole('textbox', { name: /current password/i })
      .fill(password);
    await page
      .getByRole('textbox', { name: /new password/i })
      .fill('newpassword123');
    await page
      .getByRole('textbox', { name: /confirm new password/i })
      .fill('newpassword123');

    // Submit form
    await page.getByRole('button', { name: 'Change Password' }).click();

    // Verify success message
    await expect(page.getByText('Password changed successfully')).toBeVisible();
  });

  test('should show error when new passwords do not match', async ({
    page,
  }) => {
    // Login first
    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: /email/i }).fill(username);
    await page.getByRole('textbox', { name: /password/i }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Go to settings page
    await page.goto(`${baseUrl}/settings`);

    // Click on change password section
    await page.getByRole('button', { name: /change password/i }).click();

    // Fill in password form with mismatched passwords
    await page
      .getByRole('textbox', { name: /current password/i })
      .fill(password);
    await page
      .getByRole('textbox', { name: /new password/i })
      .fill('newpassword123');
    await page
      .getByRole('textbox', { name: /confirm new password/i })
      .fill('differentpassword');

    // Submit form
    await page.getByRole('button', { name: 'Change Password' }).click();

    // Verify error message
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });
});
