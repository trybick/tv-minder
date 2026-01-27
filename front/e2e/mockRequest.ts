import { type Page } from '@playwright/test';

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
  const pattern = path.startsWith('*') ? path : `**${path}`;

  await page.route(pattern, async route => {
    if (method !== route.request().method()) {
      await route.fallback();
      return;
    }

    await route.fulfill({
      status,
      body: JSON.stringify(body),
    });
  });
};
