import { test as base, expect, Page } from '@playwright/test';

import { globalMockRequests } from './globalMockRequests';

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    // Set fixed date
    await page.clock.setFixedTime(new Date('2025-06-06T10:00:00'));

    // Don't load images to reduce API bandwidth
    await page.route('**/*', route => {
      if (route.request().resourceType() === 'image') {
        route.abort();
      } else {
        route.fallback();
      }
    });

    globalMockRequests(page);

    await use(page);
  },
});

export { expect };
