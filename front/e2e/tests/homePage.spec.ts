import { expect, test } from '../config/base';
import { showTitleToId } from '../mockData';

test.describe('Home Page', () => {
  test.describe('Search', () => {
    test('should have correct page title', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveTitle('Discover | TV Minder');
    });

    test('should clear search results when clicking X', async ({ page }) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).toBeVisible();

      await page.getByPlaceholder(/search for tv shows/i).fill('poker face');

      await expect(
        page.getByRole('button', { name: /follow/i }).first()
      ).toBeVisible();

      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).not.toBeVisible();
      await page.getByRole('button', { name: /clear input/i }).click();

      await expect(page.getByPlaceholder(/search for tv shows/i)).toHaveValue(
        ''
      );
      await expect(
        page.getByRole('button', { name: /clear input/i })
      ).not.toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).toBeVisible();
    });

    test('should clear search when clicking the site logo', async ({
      page,
    }) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).toBeVisible();

      await page.getByPlaceholder(/search for tv shows/i).fill('poker face');

      await expect(
        page.getByRole('button', { name: /follow/i }).first()
      ).toBeVisible();

      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).not.toBeVisible();

      await page
        .getByRole('heading', { name: /tv minder logo/i })
        .click({ position: { x: 0.25, y: 0.5 } });

      await expect(page.getByPlaceholder(/search for tv shows/i)).toHaveValue(
        ''
      );
      await expect(
        page.getByRole('button', { name: /clear input/i })
      ).not.toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).toBeVisible();
    });
  });

  test.describe('Discover Carousels', () => {
    test('should navigate to show page when clicking a show', async ({
      page,
    }) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).toBeVisible();

      await expect(page.getByText('MobLand').first()).toBeVisible();
      await page.getByText('MobLand').first().click();

      await expect(page).toHaveURL(`/show/${showTitleToId.mobland}`);
    });

    test('should display multiple carousel sections', async ({ page }) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Airing This Week' })
      ).toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Highest Rated' })
      ).toBeVisible();
    });

    test('should show skeleton loaders when carousels are empty', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const carousels = page.locator('[data-scope="carousel"]');
      await expect(carousels.first()).toBeVisible();
    });
  });
});
