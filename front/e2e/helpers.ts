import { expect, Page } from '@playwright/test';

import { email, password } from './mockData';
import { mockRequest } from './mockRequest';

export const login = async (page: Page) => {
  mockRequest({
    page,
    path: '/api.tv-minder.com/login',
    method: 'POST',
    body: {
      token: '123',
      email,
    },
  });

  await page.getByRole('button', { name: 'Login' }).click();

  const loginModal = page.getByRole('dialog', { name: 'Login' });
  await expect(loginModal).toBeVisible();

  await page.getByRole('textbox', { name: /email/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill(password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(loginModal).not.toBeVisible();
};
