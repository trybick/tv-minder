import { expect, test } from '../config/base';
import { login } from '../helpers';
import { showTitleToId } from '../mockData';
import { mockRequest } from '../mockRequest';

test.describe('Show Page', () => {
  test('should have correct page title', async ({ page }) => {
    await page.goto(`/show/${showTitleToId.mobland}`);

    await expect(page).toHaveTitle('MobLand | TV Minder');
  });

  test('should display show elements', async ({ page }) => {
    await page.goto(`/show/${showTitleToId.mobland}`);

    // Show name and overview
    await expect(page.getByRole('heading', { name: 'MobLand' })).toBeVisible();
    await expect(
      page.getByText(
        'Two mob families clash in a war that threatens to topple empires and lives.'
      )
    ).toBeVisible();

    // Genre tags
    await expect(page.getByText('Crime')).toBeVisible();
    await expect(page.getByText('Drama')).toBeVisible();

    // Seasons accordion
    await page.getByText('Season 1').click();
    await expect(page.getByText('Stick or Twist')).toBeVisible();
  });

  test('should redirect to home for invalid showId', async ({ page }) => {
    await page.goto('/show/invalid-id');

    await expect(page).toHaveURL('/');
  });

  test.describe('Navigation to show page', () => {
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

    test('should navigate to show page from trending now section', async ({
      page,
    }) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { name: 'Trending Now' })
      ).toBeVisible();
      await expect(page.getByText('MobLand').first()).toBeVisible({
        timeout: 10000,
      });

      await page
        .locator(`a[href="/show/${showTitleToId.mobland}"]`)
        .first()
        .click();

      await expect(page).toHaveURL(`/show/${showTitleToId.mobland}`);
    });

    test('should navigate to show page from calendar (logged out user)', async ({
      page,
    }) => {
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

      await page
        .getByText(/poker face/i)
        .first()
        .hover();
      await page.getByRole('heading', { name: 'Poker Face' }).first().click();

      await expect(page).toHaveURL(`/show/${showTitleToId.pokerface}`);
      await expect(
        page.getByRole('heading', { name: 'Poker Face' })
      ).toBeVisible();
    });

    test('should navigate to show page from calendar (logged in user)', async ({
      page,
    }) => {
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

      await page
        .getByText(/poker face/i)
        .first()
        .hover();
      await page.getByRole('heading', { name: 'Poker Face' }).first().click();

      await expect(page).toHaveURL(`/show/${showTitleToId.pokerface}`);
      await expect(
        page.getByRole('heading', { name: 'Poker Face' })
      ).toBeVisible();
    });
  });

  test('should track and untrack a show', async ({ page }) => {
    await page.goto(`/show/${showTitleToId.pokerface}`);

    const trackButton = page.getByLabel(
      `track-button-${showTitleToId.pokerface}`
    );

    await expect(trackButton).toBeVisible();
    await expect(trackButton).toHaveText(/track/i);

    await trackButton.click();
    await expect(trackButton).toHaveText(/tracking/i);

    await trackButton.click();
    await expect(trackButton).toHaveText(/track/i);
  });

  test('should show track button state for logged-in user', async ({
    page,
  }) => {
    await page.goto('/');
    await login(page);

    await page.locator('#discover-trending').scrollIntoViewIfNeeded();
    await page
      .locator(`a[href="/show/${showTitleToId.mobland}"]`)
      .first()
      .click();

    await expect(page).toHaveURL(`/show/${showTitleToId.mobland}`);

    const trackButton = page.getByLabel(
      `track-button-${showTitleToId.mobland}`
    );
    await expect(trackButton).toHaveText(/tracking/i);

    await mockRequest({
      page,
      path: '/api.tv-minder.com/track*',
      method: 'DELETE',
    });

    await trackButton.click();
    await expect(trackButton).toHaveText(/track/i);
  });
});
