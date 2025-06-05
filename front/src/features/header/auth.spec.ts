import { expect, test } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
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
    // Navigate to the home page
    await page.goto('/');

    // Click the login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for the login modal to be visible
    const loginModal = page.getByRole('dialog', { name: 'Login' });
    await expect(loginModal).toBeVisible();

    // Fill in the login form
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('password123');

    // Submit the form
    await page.getByRole('button', { name: 'Login' }).click();

    // Wait for the modal to close
    await expect(loginModal).not.toBeVisible();

    // Verify that the user is logged in by checking for the user menu
    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();

    // Verify the user's email is displayed
    await userMenu.click();
    await expect(page.getByText('test@example.com')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({
    page,
  }) => {
    // Mock failed login response
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid credentials',
        }),
      });
    });

    // Navigate to the home page
    await page.goto('/');

    // Click the login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Fill in the login form with invalid credentials
    await page
      .getByRole('textbox', { name: 'Email' })
      .fill('wrong@example.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');

    // Submit the form
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify error message is displayed
    await expect(
      page.getByText('Invalid login. Please try again.')
    ).toBeVisible();
  });
});
