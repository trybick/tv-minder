import { expect, type Page } from '@playwright/test';

import { email, password, trackResponse } from './mockData';

export const login = async (page: Page) => {
  // Mock login endpoint (matches both localhost:4500 and api.tv-minder.com)
  await page.route('**/login', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ email, token: 'mock-jwt-token' }),
      });
    } else {
      await route.fallback();
    }
  });

  await page.route('**/track', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(trackResponse),
      });
    } else {
      await route.fallback();
    }
  });

  await page
    .getByRole('navigation')
    .getByRole('button', { name: 'Login' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill(password);

  await page.getByRole('dialog').getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('button', { name: 'User menu' })).toBeVisible();
};
