import { test } from '@playwright/test';

import { baseUrl } from '../playwright.config';

test.describe('Happy Path', () => {
  test('happy path main features for logged out user', async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('happy path main features for logged in user', async ({ page }) => {
    await page.goto(baseUrl);
  });
});
