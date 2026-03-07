import { expect, test } from '../config/base';
import { login } from '../helpers';
import { showTitleToId } from '../mockData';

test.describe('Calendar Page', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation')
      .getByRole('link', { name: /calendar/i })
      .click();
    await expect(page).toHaveTitle('Calendar | TV Minder');

    await expect(page.getByText(/track your favorite shows/i)).toBeVisible();
  });

  test('shows episodes on calendar for logged out user', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('MobLand').first()).toBeVisible({
      timeout: 10000,
    });

    await page.getByLabel(`track-button-${showTitleToId.mobland}`).click();

    await page.getByPlaceholder(/search for tv shows/i).fill('poker face');
    await expect(page.getByLabel(/search-result/)).toHaveCount(2);
    await page.getByLabel(`track-button-${showTitleToId.pokerface}`).click();

    await page
      .getByRole('navigation')
      .getByRole('link', { name: /calendar/i })
      .click();
    await expect(page.getByRole('heading', { name: 'June' })).toBeVisible();

    await expect(page.getByText(/poker face/i)).toHaveCount(10);
    await expect(page.getByText(/mobland/i)).toHaveCount(2);
  });

  test('shows episodes on calendar for logged in user', async ({ page }) => {
    await page.goto('/');
    await login(page);

    await page
      .getByRole('navigation')
      .getByRole('link', { name: /calendar/i })
      .click();
    await expect(page.getByRole('heading', { name: 'June' })).toBeVisible();

    await expect(page.getByText(/poker face/i).first()).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByText(/poker face/i)).toHaveCount(10);
    await expect(page.getByText(/mobland/i)).toHaveCount(2);
  });
});
