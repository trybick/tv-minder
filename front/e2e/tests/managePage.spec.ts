import { expect, test } from '../config/base';
import { baseUrl } from '../config/playwright.config';

test.describe('Manage Page', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(baseUrl);
    await page.getByRole('link', { name: /manage/i }).click();
    await expect(page).toHaveTitle('Manage | TV Minder');
  });

  test('should display followed shows in correct tabs', async ({ page }) => {
    // follow the two shows then check the correct tabs
    await page.goto(baseUrl);
  });

  test('should not display a show after unfollowing', async ({ page }) => {
    await page.goto(baseUrl);
  });
});
