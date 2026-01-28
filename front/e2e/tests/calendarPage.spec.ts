import { expect, test } from '../config/base';
import { login } from '../helpers';
import { showTitleToId } from '../mockData';
import { mockRequest } from '../mockRequest';

test.describe('Calendar Page', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /calendar/i }).click();
    await expect(page).toHaveTitle('Calendar | TV Minder');

    await expect(
      page.getByRole('link', { name: /follow some shows/i })
    ).toBeVisible();
  });

  test('shows episodes on calendar for logged out user', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('button', { name: `follow-button-${showTitleToId.mobland}` })
      .click();

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

    await page.getByRole('button', { name: 'calendar' }).click();
    await expect(page.getByRole('heading', { name: 'June' })).toBeVisible();

    // Numbers are doubled because of the popover
    await expect(page.getByText(/poker face/i)).toHaveCount(10);
    await expect(page.getByText(/mobland/i)).toHaveCount(2);

    await page
      .getByText(/poker face/i)
      .first()
      .hover();
    await page.getByRole('heading', { name: 'Poker Face' }).first().click();

    await expect(page).toHaveURL(`/show/${showTitleToId.pokerface}`);
    await expect(
      page.getByRole('heading', { name: 'Poker Face' })
    ).toBeVisible();

    await page
      .getByRole('button', {
        name: `follow-button-${showTitleToId.pokerface}`,
      })
      .click();
    await expect(
      page.getByRole('button', {
        name: `follow-button-${showTitleToId.pokerface}`,
      })
    ).toHaveText(/follow/i);
  });

  test('shows episodes on calendar for logged in user', async ({ page }) => {
    await page.goto('/');
    await login(page);

    await page.getByRole('button', { name: 'calendar' }).click();
    await expect(page.getByRole('heading', { name: 'June' })).toBeVisible();

    // Wait for episode data to load
    await expect(page.getByText(/poker face/i).first()).toBeVisible({
      timeout: 10000,
    });

    await expect(page.getByText(/poker face/i)).toHaveCount(10);
    await expect(page.getByText(/mobland/i)).toHaveCount(2);

    await page
      .getByText(/poker face/i)
      .first()
      .hover();
    await page.getByRole('heading', { name: 'Poker Face' }).first().click();

    await expect(page).toHaveURL(`/show/${showTitleToId.pokerface}`);
    await expect(
      page.getByRole('heading', { name: 'Poker Face' })
    ).toBeVisible();

    mockRequest({
      page,
      path: '/api.tv-minder.com/follow*',
      method: 'DELETE',
    });

    await page
      .getByRole('button', {
        name: `follow-button-${showTitleToId.pokerface}`,
      })
      .click();
    await expect(
      page.getByRole('button', {
        name: `follow-button-${showTitleToId.pokerface}`,
      })
    ).toHaveText(/follow/i);
  });
});
