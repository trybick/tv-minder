import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto(baseUrl);

    await expect(page).toHaveTitle('Discover | TV Minder');
  });
});
