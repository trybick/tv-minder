import { expect, test } from '../config/base';
import { baseUrl } from '../config/playwright.config';
import { login } from '../helpers';
import { showTitleToId } from '../mockData';

test.describe('Manage Page', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(baseUrl);
    await login(page);
    await page.getByRole('link', { name: /manage/i }).click();
    await expect(page).toHaveTitle('Manage | TV Minder');
  });

  test('should display followed shows in correct tabs', async ({ page }) => {
    await page.goto(baseUrl);
    await login(page);

    await page.getByRole('link', { name: /manage/i }).click();
    await expect(page.getByText(/all/i)).toBeVisible();

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
    await page.goto(baseUrl);
    await login(page);

    await page.getByRole('link', { name: /manage/i }).click();
    await expect(page.getByText(/all/i)).toBeVisible();

    await expect(page.getByRole('button', { name: /mobland/i })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /poker face/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /mobland/i }).click();
    await expect(page).toHaveURL(`${baseUrl}/show/${showTitleToId.mobland}`);

    await page
      .getByRole('button', { name: `follow-button-${showTitleToId.mobland}` })
      .click();
    await expect(
      page.getByRole('button', {
        name: `follow-button-${showTitleToId.mobland}`,
      })
    ).toHaveText(/follow/i);

    await page.getByRole('link', { name: /manage/i }).click();

    await expect(
      page.getByRole('button', { name: /mobland/i })
    ).not.toBeVisible();
    await expect(
      page.getByRole('button', { name: /poker face/i })
    ).toBeVisible();
  });
});
