import { expect, test } from '@playwright/test';

import { popularShowsResponse, searchLastOfUsResponse } from '../mockData';
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
      body: searchLastOfUsResponse,
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

    await page.getByPlaceholder(/find tv shows/i).fill('last of us');

    await expect(page.getByLabel('search-result-The Last of Us')).toBeVisible();
    await expect(
      page.getByLabel('search-result-The Last of Us Development Series')
    ).toBeVisible();
    await expect(
      page.getByLabel('search-result-Autopsy: The Last Hours of...')
    ).toBeVisible();

    await page.getByRole('button', { name: 'follow-button-100088' }).click();

    await page.getByRole('link', { name: 'Calendar' }).click();
    await page.getByRole('link', { name: 'Episodes' }).click();
  });

  test('happy path main features for logged in user', async ({ page }) => {
    await page.goto(baseUrl);
  });
});
