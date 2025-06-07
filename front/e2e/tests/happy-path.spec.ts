import { expect, test } from '@playwright/test';

import { popularShowsResponse, searchPokerFaceResponse } from '../mockData';
import { mockRequest } from '../mockRequest';
import { baseUrl } from '../playwright.config';

test.describe('Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2025-06-06T10:00:00'));

    mockRequest({
      page,
      route: '/api.themoviedb.org/3/trending/tv/week**',
      body: popularShowsResponse,
    });

    mockRequest({
      page,
      route: '/api.themoviedb.org/3/search/tv**&query=poker+face',
      body: searchPokerFaceResponse,
    });
  });

  test('happy path main features for logged out user', async ({ page }) => {
    await page.goto(baseUrl);

    // Follow Mobland
    await page.getByRole('button', { name: 'follow-button-247718' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('status')).toHaveText(
      /we're saving your shows/i
    );

    await page.getByPlaceholder(/find tv shows/i).fill('poker face');
    await expect(page.getByLabel(/search-result/)).toHaveCount(2);

    await page.getByRole('button', { name: 'follow-button-120998' }).click();
    await page
      .getByRole('link', { name: /poker face/i })
      .first()
      .click();
    await expect(
      page.getByRole('button', { name: 'follow-button-120998' })
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

    await expect(page).toHaveURL(`${baseUrl}/show/120998`);
    await expect(
      page.getByRole('heading', { name: 'Poker Face' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'follow-button-120998' }).click();
    await expect(
      page.getByRole('button', { name: 'follow-button-120998' })
    ).toHaveText(/follow/i);
  });

  test('happy path main features for logged in user', async ({ page }) => {
    await page.goto(baseUrl);
  });
});
