import { expect, test } from '../config/base';
import { login } from '../helpers';

test.describe('Navigation and Protected Routes', () => {
  test('should redirect /manage to home when not logged in', async ({
    page,
  }) => {
    await page.goto('/manage');

    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle('Discover | TV Minder');
  });

  test('should redirect /settings to home when not logged in', async ({
    page,
  }) => {
    await page.goto('/settings');

    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle('Discover | TV Minder');
  });

  test('should show Manage link in nav after login', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('navigation').getByRole('link', { name: /manage/i })
    ).not.toBeVisible();

    await login(page);

    await expect(
      page.getByRole('navigation').getByRole('link', { name: /manage/i })
    ).toBeVisible();
  });

  test('should navigate between pages using nav links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');

    await page.getByRole('navigation').getByRole('link', { name: /calendar/i }).click();
    await expect(page).toHaveURL('/calendar');
    await expect(page).toHaveTitle('Calendar | TV Minder');

    await page
      .getByRole('navigation')
      .getByRole('link', { name: /discover/i })
      .click();
    await expect(page).toHaveURL('/');
    await expect(page).toHaveTitle('Discover | TV Minder');
  });

  test('should allow access to /manage when logged in', async ({ page }) => {
    await page.goto('/');
    await login(page);

    await page.getByRole('navigation').getByRole('link', { name: /manage/i }).click();
    await expect(page).toHaveURL('/manage');
    await expect(page).toHaveTitle('Manage | TV Minder');
  });
});
