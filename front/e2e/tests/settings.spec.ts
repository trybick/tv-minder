import { expect, test } from '../config/base';
import { baseUrl } from '../config/playwright.config';
import { email, password } from '../mockData';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          email: email,
        }),
      });
    });

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
    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('textbox', { name: /password/i }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    await page.goto(`${baseUrl}/settings`);

    await expect(page).toHaveTitle('Settings | TV Minder');

    await page.getByRole('button', { name: /change password/i }).click();

    await page
      .getByRole('textbox', { name: /current password/i })
      .fill(password);
    await page
      .getByRole('textbox', { name: /new password/i })
      .fill('newpassword123');
    await page
      .getByRole('textbox', { name: /confirm new password/i })
      .fill('newpassword123');

    await page.getByRole('button', { name: 'Change Password' }).click();

    await expect(page.getByText('Password changed successfully')).toBeVisible();
  });

  test('should show error when new passwords do not match', async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('textbox', { name: /password/i }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    await page.goto(`${baseUrl}/settings`);

    await page.getByRole('button', { name: /change password/i }).click();

    await page
      .getByRole('textbox', { name: /current password/i })
      .fill(password);
    await page
      .getByRole('textbox', { name: /new password/i })
      .fill('newpassword123');
    await page
      .getByRole('textbox', { name: /confirm new password/i })
      .fill('differentpassword');

    await page.getByRole('button', { name: 'Change Password' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });
});
