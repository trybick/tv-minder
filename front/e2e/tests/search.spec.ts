import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';

test.describe('Search', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the search API
    await page.route('**/api/shows/search*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          shows: [
            {
              id: 1,
              name: 'Test Show 1',
              rating: 9.5,
              imageUrl: 'https://example.com/show1.jpg',
            },
            {
              id: 2,
              name: 'Test Show 2',
              rating: 9.0,
              imageUrl: 'https://example.com/show2.jpg',
            },
          ],
        }),
      });
    });

    // Mock the follow API
    await page.route('**/api/follow', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
  });

  test('should search for a show and follow it', async ({ page }) => {
    await page.goto(baseUrl);

    // Type in search box
    await page.getByRole('textbox', { name: /search/i }).fill('Test Show');

    // Verify search results are visible
    await expect(page.getByText('Test Show 1')).toBeVisible();
    await expect(page.getByText('Test Show 2')).toBeVisible();

    // Follow a show
    await page
      .getByRole('button', { name: /follow/i })
      .first()
      .click();

    // Click on a show to go to its page
    await page.getByRole('link', { name: 'Test Show 1' }).click();

    // Verify navigation to show page
    await expect(page).toHaveURL(/.*\/shows\/1/);
  });

  test('should clear search results when clicking X', async ({ page }) => {
    await page.goto(baseUrl);

    // Type in search box
    await page.getByRole('textbox', { name: /search/i }).fill('Test Show');

    // Verify search results are visible
    await expect(page.getByText('Test Show 1')).toBeVisible();

    // Click the X button to clear search
    await page.getByRole('button', { name: /clear search/i }).click();

    // Verify search results are no longer visible
    await expect(page.getByText('Test Show 1')).not.toBeVisible();
  });
});
