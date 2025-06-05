import { expect, test } from '../../../test/api-mock';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to be loaded
    await page.waitForLoadState('networkidle');

    // Add your assertions here
    await expect(page).toHaveTitle(/TV Minder/);
  });

  test('should display shows list', async ({ page }) => {
    await page.goto('/');

    // Wait for the shows to be loaded
    await page.waitForLoadState('networkidle');

    // Add your assertions here
    const showsList = page.locator('[data-testid="shows-list"]');
    await expect(showsList).toBeVisible();
  });
});
