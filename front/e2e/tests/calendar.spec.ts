import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the current date to be in the middle of a month
    await page.evaluate(() => {
      const mockDate = new Date('2024-03-15');
      Object.defineProperty(window, 'Date', {
        value: class extends Date {
          constructor() {
            super();
            return mockDate;
          }
        },
        writable: true,
      });
    });

    // Mock the calendar episodes API
    await page.route('**/api/calendar/episodes', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          episodes: [
            {
              id: 1,
              showId: 123,
              showName: 'Test Show 1',
              episodeNumber: 1,
              seasonNumber: 1,
              airDate: '2024-03-15',
              title: 'Test Episode 1',
            },
            {
              id: 2,
              showId: 456,
              showName: 'Test Show 2',
              episodeNumber: 2,
              seasonNumber: 1,
              airDate: '2024-03-15',
              title: 'Test Episode 2',
            },
          ],
        }),
      });
    });
  });

  test('should follow shows and display them on calendar', async ({ page }) => {
    // Mock the follow API
    await page.route('**/api/follow', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto(`${baseUrl}/popular`);

    // Follow a show from popular page
    await page
      .getByRole('button', { name: /follow/i })
      .first()
      .click();

    // Search and follow another show
    await page.getByRole('textbox', { name: /search/i }).fill('Test Show');
    await page
      .getByRole('button', { name: /follow/i })
      .first()
      .click();

    // Go to calendar
    await page.goto(`${baseUrl}/calendar`);

    // Verify calendar events are visible
    const calendarEvents = page.getByRole('button', { name: /Test Show/i });
    await expect(calendarEvents).toHaveCount(2);

    // Hover over an event and verify popover
    await calendarEvents.first().hover();
    await expect(page.getByText('Test Episode 1')).toBeVisible();

    // Click event and verify navigation to show page
    await calendarEvents.first().click();
    await expect(page).toHaveURL(/.*\/shows\/123/);
  });

  test('should navigate between months and return to today', async ({
    page,
  }) => {
    await page.goto(`${baseUrl}/calendar`);

    // Verify we're on March 2024
    await expect(page.getByText('March 2024')).toBeVisible();

    // Click back arrow to go to previous month
    await page.getByRole('button', { name: /previous month/i }).click();
    await expect(page.getByText('February 2024')).toBeVisible();

    // Click today button
    await page.getByRole('button', { name: /today/i }).click();
    await expect(page.getByText('March 2024')).toBeVisible();
  });
});
