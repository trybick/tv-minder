import { expect, test } from '../config/base';
import { login } from '../helpers';
import { email, password } from '../mockData';
import { mockRequest } from '../mockRequest';

test.describe('Login and Signup flows', () => {
  test('should successfully log in with email and password', async ({
    page,
  }) => {
    await page.goto('/');
    await login(page);

    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();

    await userMenu.click();
    await expect(page.getByText(email)).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({
    page,
  }) => {
    mockRequest({
      page,
      path: '/api.tv-minder.com/login',
      method: 'POST',
      status: 401,
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();

    await page
      .getByRole('textbox', { name: /email/i })
      .fill('wrong@example.com');
    await page
      .getByRole('textbox', { name: /password/i })
      .fill('wrongpassword');

    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Login' })
      .click();

    await expect(
      page.getByText('Invalid login. Please try again.')
    ).toBeVisible();
  });

  test('should successfully sign up as a new user', async ({ page }) => {
    await mockRequest({
      page,
      path: '/register',
      method: 'POST',
      status: 201,
    });
    mockRequest({
      page,
      path: '/api.tv-minder.com/login',
      method: 'POST',
      body: {
        token: '123',
        email,
      },
    });

    await page.goto('/');
    await page
      .getByRole('navigation')
      .getByRole('button', { name: 'Sign Up' })
      .click();

    const signupModal = page.getByRole('dialog');
    await expect(signupModal).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill(email);

    const allPasswords = await page
      .getByRole('textbox', { name: /password/i })
      .all();
    await allPasswords[0].fill(password);
    await allPasswords[1].fill(password);

    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Sign Up' })
      .click();

    await expect(signupModal).not.toBeVisible();
    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await expect(userMenu).toBeVisible();
  });

  test('should show error when passwords do not match during signup', async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .getByRole('navigation')
      .getByRole('button', { name: 'Sign Up' })
      .click();

    const signupModal = page.getByRole('dialog');
    await expect(signupModal).toBeVisible();

    await page.getByRole('textbox', { name: /email/i }).fill(email);

    const allPasswords = await page
      .getByRole('textbox', { name: /password/i })
      .all();
    await allPasswords[0].fill(password);
    await allPasswords[1].fill('differentpassword');

    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'Sign Up' })
      .click();
    await expect(page.getByText('Passwords do not match')).toBeVisible();
  });

  test('should handle forgot password flow', async ({ page }) => {
    await mockRequest({
      page,
      method: 'POST',
      path: '/requestonetimecode',
    });
    await mockRequest({
      page,
      method: 'POST',
      path: '/verifyonetimecode',
    });
    await mockRequest({
      page,
      method: 'POST',
      path: '/changepasswordforreset',
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Forgot Password?' }).click();

    await page.getByRole('textbox', { name: /email/i }).fill(email);
    await page.getByRole('button', { name: 'Send Code' }).click();

    await expect(page.getByRole('textbox', { name: /email/i })).toBeDisabled();

    await page
      .getByRole('textbox', { name: /enter verification code/i })
      .fill('12345');

    await page.getByRole('button', { name: 'Verify' }).click();
    await page.getByRole('textbox', { name: /new password/i }).fill(password);
    await page.getByRole('button', { name: 'Change Password' }).click();

    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('status')).toHaveText(/password changed/i);
  });

  test('should be able to logout', async ({ page }) => {
    await page.goto('/');
    await login(page);

    const userMenu = page.getByRole('button', { name: 'Page Options' });
    await userMenu.click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    await expect(
      page.getByRole('navigation').getByRole('button', { name: 'Login' })
    ).toBeVisible();
    await expect(
      page.getByRole('navigation').getByRole('button', { name: 'Sign Up' })
    ).toBeVisible();

    await expect(userMenu).not.toBeVisible();
  });
});
