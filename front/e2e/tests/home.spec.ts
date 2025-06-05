import { expect, test } from '@playwright/test';

import { baseURL } from '../playwright.config';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto(baseURL);

    await expect(page).toHaveTitle('Discover | TV Minder');
  });
});
