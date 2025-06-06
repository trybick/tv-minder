import { Page } from '@playwright/test';

export const mockRequest = async ({
  page,
  route,
  status = 200,
  body,
}: {
  page: Page;
  route: string;
  status?: number;
  body?: Record<string, unknown>;
}) => {
  await page.route(`**${route}`, async route => {
    await route.fulfill({
      status,
      body: JSON.stringify(body),
    });
  });
};
