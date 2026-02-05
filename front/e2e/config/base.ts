import { test as base, expect, type Page } from '@playwright/test';

import { globalMockRequests } from './globalMockRequests';

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    // Set fixed date
    await page.clock.setFixedTime(new Date('2025-06-06T10:00:00'));

    // Don't load images to reduce API bandwidth
    await page.route('**/*', async route => {
      if (route.request().resourceType() === 'image') {
        await route.abort();
      } else {
        await route.fallback();
      }
    });

    await globalMockRequests(page);

    await use(page);

    // Avoid any pending routing work during teardown.
    await page.unroute('**/*');
  },
});

export { expect };
