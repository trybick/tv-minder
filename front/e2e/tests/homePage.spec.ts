import { baseUrl } from '../../playwright.config';
import { expect, test } from '../config/base';
import { showTitleToId } from '../mockData';

test.describe('Home Page', () => {
  test.describe('Search', () => {
    test('should have correct page title', async ({ page }) => {
      await page.goto(baseUrl);
      await expect(page).toHaveTitle('Discover | TV Minder');
    });

    test('should clear search results when clicking X', async ({ page }) => {
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
    test('should navigate to show page when clicking a show', async ({
      page,
    }) => {
      await page.goto(`${baseUrl}`);
      await page.getByRole('button', { name: /mobland/i }).click();

      await expect(page).toHaveURL(`${baseUrl}/show/${showTitleToId.mobland}`);
    });
  });
});
