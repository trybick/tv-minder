import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';

test.describe('Search', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveTitle('Discover | TV Minder');
  });

  test('should clear search results when clicking X', async ({ page }) => {
    await page.goto(baseUrl);

    await page.getByRole('textbox', { name: /search/i }).fill('Test Show');

    await expect(page.getByText('Test Show 1')).toBeVisible();

    await page.getByRole('button', { name: /clear search/i }).click();

    await expect(page.getByText('Test Show 1')).not.toBeVisible();
  });

  test('should clear search when clicking the site logo', async ({ page }) => {
    await page.goto(baseUrl);

    await page.getByRole('textbox', { name: /search/i }).fill('Test Show');

    await expect(page.getByText('Test Show 1')).toBeVisible();

    await page.getByRole('button', { name: /clear search/i }).click();

    await expect(page.getByText('Test Show 1')).not.toBeVisible();
  });
});
