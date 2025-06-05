import { test as base } from '@playwright/test';

export const test = base.extend<{ mockApi: void }>({
  mockApi: async ({ page }, use) => {
    await page.route('**/api/**', async route => {
      const url = route.request().url();

      // Add your mock responses here
      const mockResponses: Record<string, any> = {
        '/api/shows': { shows: [] },
        '/api/episodes': { episodes: [] },
        // Add more mock responses as needed
      };

      const path = new URL(url).pathname;
      const mockResponse = mockResponses[path] || { error: 'Not found' };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    await use();
  },
});

export { expect } from '@playwright/test';
