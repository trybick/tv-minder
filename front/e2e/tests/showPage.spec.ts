import { expect, test } from '../config/base';
import { login } from '../helpers';
import { showTitleToId } from '../mockData';
import { mockRequest } from '../mockRequest';

test.describe('Show Page', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(`/show/${showTitleToId.mobland}`);

    await expect(page).toHaveTitle('MobLand | TV Minder');
  });

  test('should display show name and overview', async ({ page }) => {
    await page.goto(`/show/${showTitleToId.mobland}`);

    await expect(
      page.getByRole('heading', { name: 'MobLand' })
    ).toBeVisible();
    await expect(
      page.getByText(
        'Two mob families clash in a war that threatens to topple empires and lives.'
      )
    ).toBeVisible();
  });

  test('should display genre tags', async ({ page }) => {
    await page.goto(`/show/${showTitleToId.mobland}`);

    await expect(page.getByText('Crime')).toBeVisible();
    await expect(page.getByText('Drama')).toBeVisible();
  });

  test('should display seasons accordion with episodes', async ({ page }) => {
    await page.goto(`/show/${showTitleToId.mobland}`);

    await expect(
      page.getByRole('heading', { name: 'Episodes' })
    ).toBeVisible();

    await expect(page.getByText('Season 1')).toBeVisible();
    await expect(page.getByText('10 Episodes')).toBeVisible();

    await page.getByText('Season 1').click();

    await expect(page.getByText('Stick or Twist')).toBeVisible();
  });

  test('should follow and unfollow a show', async ({ page }) => {
    await page.goto(`/show/${showTitleToId.pokerface}`);

    const followButton = page.getByLabel(
      `follow-button-${showTitleToId.pokerface}`
    );

    await expect(followButton).toBeVisible();
    await expect(followButton).toHaveText(/track/i);

    await followButton.click();
    await expect(followButton).toHaveText(/tracking/i);

    await followButton.click();
    await expect(followButton).toHaveText(/track/i);
  });

  test('should redirect to home for invalid showId', async ({ page }) => {
    await page.goto('/show/invalid-id');

    await expect(page).toHaveURL('/');
  });

  test('should redirect to home for negative showId', async ({ page }) => {
    await page.goto('/show/-1');

    await expect(page).toHaveURL('/');
  });

  test('should navigate to show page from search results', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByPlaceholder(/search for tv shows/i).fill('poker face');
    await expect(page.getByLabel(/search-result/).first()).toBeVisible();

    await page
      .getByRole('link', { name: /poker face/i })
      .first()
      .click();

    await expect(page).toHaveURL(`/show/${showTitleToId.pokerface}`);
    await expect(
      page.getByRole('heading', { name: 'Poker Face' })
    ).toBeVisible();
  });

  test('should show follow button state for logged-in user', async ({
    page,
  }) => {
    await page.goto('/');
    await login(page);

    await page
      .getByRole('link', { name: /mobland/i })
      .first()
      .click();

    await expect(page).toHaveURL(`/show/${showTitleToId.mobland}`);

    const followButton = page.getByLabel(
      `follow-button-${showTitleToId.mobland}`
    );
    await expect(followButton).toHaveText(/tracking/i);

    await mockRequest({
      page,
      path: '/api.tv-minder.com/follow*',
      method: 'DELETE',
    });

    await followButton.click();
    await expect(followButton).toHaveText(/track/i);
  });
});
