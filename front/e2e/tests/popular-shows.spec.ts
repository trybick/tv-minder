import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';

test.describe('Popular Shows', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the popular shows API
    await page.route('**/api/shows/popular', async route => {
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
            {
              id: 3,
              name: 'Test Show 3',
              rating: 8.5,
              imageUrl: 'https://example.com/show3.jpg',
            },
          ],
        }),
      });
    });
  });

  test('should navigate to show page when clicking a show', async ({
    page,
  }) => {
    await page.goto(`${baseUrl}/popular`);

    // Click the first show
    await page.getByRole('link', { name: 'Test Show 1' }).click();

    // Verify navigation to show page
    await expect(page).toHaveURL(/.*\/shows\/1/);
  });

  test('should navigate to show page when clicking Top Rated', async ({
    page,
  }) => {
    await page.goto(`${baseUrl}/popular`);

    // Click the Top Rated link
    await page.getByRole('link', { name: 'Top Rated' }).click();

    // Verify navigation to show page
    await expect(page).toHaveURL(/.*\/shows\/1/);
  });

  test('should show more shows when clicking Show More', async ({ page }) => {
    // Mock the API to return more shows when paginated
    await page.route('**/api/shows/popular?page=2', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          shows: [
            {
              id: 4,
              name: 'Test Show 4',
              rating: 8.0,
              imageUrl: 'https://example.com/show4.jpg',
            },
            {
              id: 5,
              name: 'Test Show 5',
              rating: 7.5,
              imageUrl: 'https://example.com/show5.jpg',
            },
          ],
        }),
      });
    });

    await page.goto(`${baseUrl}/popular`);

    // Verify initial shows are visible
    await expect(page.getByText('Test Show 1')).toBeVisible();
    await expect(page.getByText('Test Show 2')).toBeVisible();
    await expect(page.getByText('Test Show 3')).toBeVisible();

    // Click Show More
    await page.getByRole('button', { name: 'Show More' }).click();

    // Verify additional shows are visible
    await expect(page.getByText('Test Show 4')).toBeVisible();
    await expect(page.getByText('Test Show 5')).toBeVisible();
  });
});
