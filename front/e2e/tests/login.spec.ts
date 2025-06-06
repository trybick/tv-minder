import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';
import { email, password, token } from '../shared';

test.describe('Authentication', () => {
  // Maybe remove this to let real api work?
  // test.beforeEach(async ({ page }) => {
  //   await page.route('**/login', async route => {
  //     await route.fulfill({
  //       body: JSON.stringify({
  //         token,
  //         email,
  //       }),
  //     });
  //   });
  // });

  test('should successfully log in with email and password', async ({
    page,
  }) => {
    await page.goto(baseUrl);

    await page.getByRole('button', { name: 'Login' }).click();

    const loginModal = page.getByRole('dialog', { name: 'Login' });
    await expect(loginModal).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('textbox', { name: /password/i }).fill(password);

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(loginModal).not.toBeVisible();

    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();

    await userMenu.click();
    await expect(page.getByText(email)).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({
    page,
  }) => {
    await page.route('**/login', async route => {
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

  test('should successfully sign up as a new user', async ({ page }) => {
    await page.route('**/register', async route => {
      await route.fulfill({
        status: 201,
        body: JSON.stringify({
          message: 'User created',
        }),
      });
    });
    await page.route('**/login', async route => {
      await route.fulfill({
        body: JSON.stringify({
          token,
          email,
        }),
      });
    });

    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    const signupModal = page.getByRole('dialog', { name: 'Sign Up' });
    await expect(signupModal).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill(email);

    const allPasswords = await page
      .getByRole('textbox', { name: /password/i })
      .all();
    await allPasswords[0].fill(password);
    await allPasswords[1].fill(password);

    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(signupModal).not.toBeVisible();
    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();
  });

  test('should show error when passwords do not match during signup', async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Sign Up' }).click();

    const signupModal = page.getByRole('dialog', { name: 'Sign Up' });
    await expect(signupModal).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('textbox', { name: /password/i }).fill(password);
    await page
      .getByRole('textbox', { name: /confirm password/i })
      .fill('differentpassword');

    await page.getByRole('button', { name: 'Sign Up' }).click();

    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should handle forgot password flow', async ({ page }) => {
    await page.route('**/api/forgot-password', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Password reset email sent',
        }),
      });
    });

    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Login' }).click();

    const loginModal = page.getByRole('dialog', { name: 'Login' });
    await expect(loginModal).toBeVisible();

    await page.getByRole('link', { name: 'Forgot Password?' }).click();

    const forgotPasswordModal = page.getByRole('dialog', {
      name: 'Forgot Password',
    });
    await expect(forgotPasswordModal).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('button', { name: 'Send Reset Link' }).click();

    await expect(page.getByText('Password reset email sent')).toBeVisible();
  });

  test('should handle Google login', async ({ page }) => {
    await page.route('**/api/auth/google', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token,
          email: 'googleuser@test.com',
        }),
      });
    });

    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Login' }).click();

    const loginModal = page.getByRole('dialog', { name: 'Login' });
    await expect(loginModal).toBeVisible();

    await page.getByRole('button', { name: 'Continue with Google' }).click();

    const popup = await page.waitForEvent('popup');
    await popup.route('**/oauth2/v2/auth', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-google-token',
        }),
      });
    });

    await expect(loginModal).not.toBeVisible();
    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();
  });
});
