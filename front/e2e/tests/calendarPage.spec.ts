import { expect, test } from '../config/base';
import { login } from '../helpers';
import { showTitleToId } from '../mockData';

test.describe('Calendar Page', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /calendar/i }).click();
    await expect(page).toHaveTitle('Calendar | TV Minder');

    await expect(
      page.getByRole('link', { name: /follow some shows/i })
    ).toBeVisible();
  });

  test('can follow shows and navigate to calendar', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Trending Now' })
    ).toBeVisible();

    await expect(page.getByText('MobLand').first()).toBeVisible({
      timeout: 10000,
    });

    await page.getByLabel(`follow-button-${showTitleToId.mobland}`).click();

    await page.getByPlaceholder(/search for tv shows/i).fill('poker face');
    await expect(page.getByLabel(/search-result/)).toHaveCount(2);

    await page
      .getByRole('button', {
        name: `follow-button-${showTitleToId.pokerface}`,
      })
      .click();
    await page
      .getByRole('link', { name: /poker face/i })
      .first()
      .click();
    await expect(
      page.getByRole('button', {
        name: `follow-button-${showTitleToId.pokerface}`,
      })
    ).toHaveText(/unfollow/i);

    await page.getByRole('link', { name: /calendar/i }).click();
    await expect(page.getByRole('heading', { name: 'June' })).toBeVisible();

    // Navigate back to a show page from the header
    await page.getByRole('link', { name: /discover/i }).click();
    await expect(
      page.getByRole('heading', { name: 'Trending Now' })
    ).toBeVisible();
  });

  test('can view calendar when logged in', async ({ page }) => {
    await page.goto('/');
    await login(page);

    await page.getByRole('link', { name: /calendar/i }).click();
    await expect(page.getByRole('heading', { name: 'June' })).toBeVisible();

    // Verify calendar grid is visible
    await expect(page.getByRole('grid')).toBeVisible();
  });
});
