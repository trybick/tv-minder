import { Page } from '@playwright/test';

export const mockRequest = async ({
  page,
  path,
  method = 'GET',
  status = 200,
  body,
}: {
  page: Page;
  path: string;
  method?: string;
  status?: number;
  body?: any;
}) => {
  await page.route(`**${path}`, async route => {
    if (method !== route.request().method()) {
      return;
    }

    await route.fulfill({
      status,
      body: JSON.stringify(body),
    });
  });
};
