import { expect, test } from '../config/base';
import { login } from '../helpers';

test.describe('Header', () => {
  test('should navigate to home page when clicking the logo', async ({
    page,
  }) => {
    await page.goto('/calendar');

    await page.getByRole('button', { name: /tv minder logo/i }).click();

    await expect(page).toHaveURL('/');
  });

  test('should show Discover and Calendar links for logged out user', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('navigation').getByRole('link', { name: /discover/i })
    ).toBeVisible();
    await expect(
      page.getByRole('navigation').getByRole('link', { name: /calendar/i })
    ).toBeVisible();
  });

  test('should show Login and Sign Up buttons for logged out user', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('navigation').getByRole('button', { name: 'Login' })
    ).toBeVisible();
    await expect(
      page.getByRole('navigation').getByRole('button', { name: 'Sign Up' })
    ).toBeVisible();
  });

  test('should show user menu and hide auth buttons after login', async ({
    page,
  }) => {
    await page.goto('/');
    await login(page);

    await expect(
      page.getByRole('button', { name: 'User menu' })
    ).toBeVisible();
    await expect(
      page.getByRole('navigation').getByRole('button', { name: 'Login' })
    ).not.toBeVisible();
    await expect(
      page.getByRole('navigation').getByRole('button', { name: 'Sign Up' })
    ).not.toBeVisible();
  });
});
