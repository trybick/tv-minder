import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';
import { username } from '../shared';

test.describe('Header', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login for tests that require authentication
    await page.route('**/api/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          email: username,
        }),
      });
    });
  });

  test('should toggle color mode when clicking the color mode button', async ({
    page,
  }) => {
    await page.goto(baseUrl);

    const colorModeButton = page.getByRole('button', { name: /color mode/i });
    await expect(colorModeButton).toBeVisible();

    // Get initial color mode
    const initialColorMode = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    // Click the color mode button
    await colorModeButton.click();

    // Get new color mode
    const newColorMode = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    // Verify the color mode has changed
    expect(newColorMode).not.toBe(initialColorMode);
  });

  test('should navigate to home page when clicking the logo', async ({
    page,
  }) => {
    // First navigate to a show page
    await page.goto(`${baseUrl}/shows/123`); // Replace with actual show ID

    // Click the logo
    await page.getByRole('link', { name: /logo/i }).click();

    // Verify we're back on the home page
    await expect(page).toHaveURL(baseUrl);
  });
});
