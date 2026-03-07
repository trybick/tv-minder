import { test as base, expect, type Page } from '@playwright/test';

import { globalMockRequests } from './globalMockRequests';

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    await page.clock.setFixedTime(new Date('2025-06-06T10:00:00'));

    await globalMockRequests(page);

    await use(page);
  },
});

export { expect };
