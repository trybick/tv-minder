import { expect, test } from '../config/base';
import { baseUrl } from '../config/playwright.config';
import { login } from '../helpers';
import { email, password } from '../mockData';
import { mockRequest } from '../mockRequest';

test.describe('Login and Signup flows', () => {
  test('should successfully log in with email and password', async ({
    page,
  }) => {
    await page.goto(baseUrl);
    await login(page);

    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();

    await userMenu.click();
    await expect(page.getByText(email)).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({
    page,
  }) => {
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
    await mockRequest({
      page,
      path: '/register',
      status: 201,
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

    const allPasswords = await page
      .getByRole('textbox', { name: /password/i })
      .all();
    await allPasswords[0].fill(password);
    await allPasswords[1].fill('differentpassword');

    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should handle forgot password flow', async ({ page }) => {
    await mockRequest({
      page,
      path: '/requestonetimecode',
    });
    await mockRequest({
      page,
      path: '/verifyonetimecode',
    });
    await mockRequest({
      page,
      path: '/changepasswordforreset',
    });

    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Login' }).click();

    const loginModal = page.getByRole('dialog', { name: 'Login' });
    await expect(loginModal).toBeVisible();

    await page.getByRole('button', { name: 'Forgot Password?' }).click();

    const forgotPasswordModal = page.getByRole('dialog', {
      name: 'Forgot Password',
    });
    await expect(forgotPasswordModal).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();
    await expect(loginModal).toBeVisible();

    await page.getByRole('button', { name: 'Forgot Password?' }).click();
    await expect(forgotPasswordModal).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('button', { name: 'Send Code' }).click();

    await expect(page.getByRole('textbox', { name: /email/i })).toBeDisabled();

    await page
      .getByRole('textbox', { name: /enter verification code/i })
      .fill('12345');

    await page.getByRole('button', { name: 'Verify' }).click();
    await page.getByRole('textbox', { name: /new password/i }).fill(password);
    await page.getByRole('button', { name: 'Change Password' }).click();

    await expect(forgotPasswordModal).not.toBeVisible();
    await expect(loginModal).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();

    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('status')).toHaveText(/password changed/i);
  });
});
