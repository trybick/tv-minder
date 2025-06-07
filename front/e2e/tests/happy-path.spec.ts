import { expect, test } from '@playwright/test';

import { popularShowsResponse, searchGameOfThronesResponse } from '../mockData';
import { mockRequest } from '../mockRequest';
import { baseUrl } from '../playwright.config';

test.describe('Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    mockRequest({
      page,
      route: '**/api.themoviedb.org/3/trending/tv/week',
      body: popularShowsResponse,
    });

    mockRequest({
      page,
      route: '**/api.themoviedb.org/3/search/tv**&query=game+of+thrones',
      body: searchGameOfThronesResponse,
    });
  });

  test('happy path main features for logged out user', async ({ page }) => {
    await page.goto(baseUrl);

    await page.getByRole('button', { name: 'follow-button-232766' }).click();
    await page.getByRole('button', { name: 'follow-button-247718' }).click();

    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('status')).toHaveText(
      /we're saving your shows/i
    );

    await page.getByPlaceholder(/find tv shows/i).fill('game of thrones');

    await expect(
      page.getByLabel('search-result-Game of Thrones')
    ).toBeVisible();
    await expect(
      page.getByLabel(
        "search-result-The Game of Thrones Reunion Hosted by Conan O'Brien"
      )
    ).toBeVisible();
    await expect(
      page.getByLabel('search-result-House of the Dragon')
    ).toBeVisible();
    await expect(
      page.getByLabel(
        'search-result-A Knight of the Seven Kingdoms: The Hedge Knight'
      )
    ).toBeVisible();

    await page.getByRole('button', { name: 'follow-button-1399' }).click();

    await page.getByRole('link', { name: 'Calendar' }).click();
    await page.getByRole('link', { name: 'Episodes' }).click();
  });

  test('happy path main features for logged in user', async ({ page }) => {
    await page.goto(baseUrl);
  });
});
