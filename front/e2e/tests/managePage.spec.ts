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
    await expect(page.getByText('Airing Now')).toBeVisible();

    await expect(page.getByRole('button', { name: /mobland/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /poker face/i })
    ).toBeVisible();

    await page.getByRole('tab', { name: /airing now/i }).click();
    await expect(page.getByRole('button', { name: /mobland/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /poker face/i })
    ).toBeVisible();
  });

  test('should not display a show after unfollowing', async ({ page }) => {
    await page.goto('/');
    await login(page);

    await page.getByRole('link', { name: /manage/i }).click();
    await expect(page.getByText('Airing Now')).toBeVisible();

    await expect(page.getByRole('button', { name: /mobland/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /poker face/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /mobland/i }).click();
    await expect(page).toHaveURL(`/show/${showTitleToId.mobland}`);

    mockRequest({
      page,
      path: '/api.tv-minder.com/follow*',
      method: 'DELETE',
    });

    await page
      .getByRole('button', { name: `follow-button-${showTitleToId.mobland}` })
      .click();
    await expect(
      page.getByRole('button', {
        name: `follow-button-${showTitleToId.mobland}`,
      })
    ).toHaveText(/follow/i);

    await page.getByRole('link', { name: /manage/i }).click();

    await expect(page.getByText(/mobland/i)).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: /poker face/i })
    ).toBeVisible();
  });
});
