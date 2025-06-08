import { expect, test } from '../fixtures';
import { searchPokerFaceResponse } from '../mockData';
import { mockRequest } from '../mockRequest';
import { baseUrl } from '../playwright.config';

test.describe('Home Page', () => {
  test.describe('Search', () => {
    test('should have correct page title', async ({ page }) => {
      await page.goto(baseUrl);
      await expect(page).toHaveTitle('Discover | TV Minder');
    });

    test('should clear search results when clicking X', async ({ page }) => {
      mockRequest({
        page,
        path: '/api.themoviedb.org/3/search/tv**&query=poker+face',
        body: searchPokerFaceResponse,
      });

      await page.goto(baseUrl);

      await expect(
        page.getByRole('heading', { name: 'Popular' })
      ).toBeVisible();

      await page.getByPlaceholder(/find tv shows/i).fill('poker face');

      await expect(
        page.getByRole('button', { name: /follow/i }).first()
      ).toBeVisible();

      await expect(
        page.getByRole('heading', { name: 'Popular' })
      ).not.toBeVisible();
      await page.getByRole('button', { name: /clear input/i }).click();

      await expect(page.getByPlaceholder(/find tv shows/i)).toHaveValue('');
      await expect(
        page.getByRole('button', { name: /clear input/i })
      ).not.toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Popular' })
      ).toBeVisible();
    });

    test('should clear search when clicking the site logo', async ({
      page,
    }) => {
      mockRequest({
        page,
        path: '/api.themoviedb.org/3/search/tv**&query=poker+face',
        body: searchPokerFaceResponse,
      });

      await page.goto(baseUrl);

      await expect(
        page.getByRole('heading', { name: 'Popular' })
      ).toBeVisible();

      await page.getByPlaceholder(/find tv shows/i).fill('poker face');

      await expect(
        page.getByRole('button', { name: /follow/i }).first()
      ).toBeVisible();

      await expect(
        page.getByRole('heading', { name: 'Popular' })
      ).not.toBeVisible();

      await page
        .getByRole('heading', { name: /tv minder logo/i })
        .click({ position: { x: 0.25, y: 0.5 } });

      await expect(page.getByPlaceholder(/find tv shows/i)).toHaveValue('');
      await expect(
        page.getByRole('button', { name: /clear input/i })
      ).not.toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Popular' })
      ).toBeVisible();
    });
  });

  test.describe('Popular Shows', () => {
    test.beforeEach(async ({ page }) => {
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

      await page.getByRole('link', { name: 'Test Show 1' }).click();

      await expect(page).toHaveURL(/.*\/shows\/1/);
    });

    test('should navigate to show page when clicking Top Rated', async ({
      page,
    }) => {
      await page.goto(`${baseUrl}/popular`);

      await page.getByRole('link', { name: 'Top Rated' }).click();

      await expect(page).toHaveURL(/.*\/shows\/1/);
    });

    test('should show more shows when clicking Show More', async ({ page }) => {
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

      await expect(page.getByText('Test Show 1')).toBeVisible();
      await expect(page.getByText('Test Show 2')).toBeVisible();
      await expect(page.getByText('Test Show 3')).toBeVisible();

      await page.getByRole('button', { name: 'Show More' }).click();

      await expect(page.getByText('Test Show 4')).toBeVisible();
      await expect(page.getByText('Test Show 5')).toBeVisible();
    });
  });
});
