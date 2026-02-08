import { expect, test } from '../config/base';
import { login } from '../helpers';
import { showTitleToId } from '../mockData';
import { mockRequest } from '../mockRequest';

test.describe('Manage Page', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    await login(page);
    await page.getByRole('link', { name: /manage/i }).click();
    await expect(page).toHaveTitle('Manage | TV Minder');
  });

  test('should display followed shows in correct tabs', async ({ page }) => {
    await page.goto('/');
    await login(page);

    await page.getByRole('link', { name: /manage/i }).click();

    // Wait for followed shows data to load
    await expect(page.getByRole('tab', { name: 'Airing Now' })).toBeVisible({
      timeout: 10000,
    });

    await expect(
      page.getByRole('link', { name: /mobland/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /poker face/i }).first()
    ).toBeVisible();

    await page.getByRole('tab', { name: /airing now/i }).click();
    await expect(
      page.getByRole('link', { name: /mobland/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /poker face/i }).first()
    ).toBeVisible();
  });

  test('should not display a show after unfollowing', async ({ page }) => {
    await page.goto('/');
    await login(page);

    await page.getByRole('link', { name: /manage/i }).click();

    // Wait for followed shows data to load
    await expect(page.getByRole('tab', { name: 'Airing Now' })).toBeVisible({
      timeout: 10000,
    });

    await expect(
      page.getByRole('link', { name: /mobland/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /poker face/i }).first()
    ).toBeVisible();

    await page
      .getByRole('link', { name: /mobland/i })
      .first()
      .click();
    await expect(page).toHaveURL(`/show/${showTitleToId.mobland}`);

    mockRequest({
      page,
      path: '/api.tv-minder.com/follow*',
      method: 'DELETE',
    });

    await page.getByLabel(`follow-button-${showTitleToId.mobland}`).click();
    await expect(
      page.getByLabel(`follow-button-${showTitleToId.mobland}`)
    ).toHaveText(/follow/i);

    await page.getByRole('link', { name: /manage/i }).click();

    await expect(page.getByLabel(/show-card-mobland/i)).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: /poker face/i }).first()
    ).toBeVisible();
  });
});
