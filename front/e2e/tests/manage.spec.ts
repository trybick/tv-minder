import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';
import { username } from '../shared';

test.describe('Manage Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock login
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

    // Mock followed shows API
    await page.route('**/api/follow', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          shows: [
            {
              id: 1,
              name: 'Test Show 1',
              rating: 9.5,
              imageUrl: 'https://example.com/show1.jpg',
              status: 'watching',
            },
            {
              id: 2,
              name: 'Test Show 2',
              rating: 9.0,
              imageUrl: 'https://example.com/show2.jpg',
              status: 'completed',
            },
            {
              id: 3,
              name: 'Test Show 3',
              rating: 8.5,
              imageUrl: 'https://example.com/show3.jpg',
              status: 'plan_to_watch',
            },
          ],
        }),
      });
    });
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto(`${baseUrl}/manage`);
    await expect(page).toHaveTitle('Manage Shows | TV Minder');
  });

  test('should display followed shows and handle tab switching', async ({
    page,
  }) => {
    // Login first
    await page.goto(baseUrl);
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: /email/i }).fill(username);
    await page.getByRole('textbox', { name: /password/i }).fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    // Go to manage page
    await page.goto(`${baseUrl}/manage`);

    // Verify all shows are visible initially
    await expect(page.getByText('Test Show 1')).toBeVisible();
    await expect(page.getByText('Test Show 2')).toBeVisible();
    await expect(page.getByText('Test Show 3')).toBeVisible();

    // Click on Watching tab
    await page.getByRole('tab', { name: 'Watching' }).click();
    await expect(page.getByText('Test Show 1')).toBeVisible();
    await expect(page.getByText('Test Show 2')).not.toBeVisible();
    await expect(page.getByText('Test Show 3')).not.toBeVisible();

    // Click on Completed tab
    await page.getByRole('tab', { name: 'Completed' }).click();
    await expect(page.getByText('Test Show 1')).not.toBeVisible();
    await expect(page.getByText('Test Show 2')).toBeVisible();
    await expect(page.getByText('Test Show 3')).not.toBeVisible();

    // Click on Plan to Watch tab
    await page.getByRole('tab', { name: 'Plan to Watch' }).click();
    await expect(page.getByText('Test Show 1')).not.toBeVisible();
    await expect(page.getByText('Test Show 2')).not.toBeVisible();
    await expect(page.getByText('Test Show 3')).toBeVisible();
  });
});
