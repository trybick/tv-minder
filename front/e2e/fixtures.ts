import { test as base, Page } from '@playwright/test';

import { searchPokerFaceResponse } from './mockData';
import { mockRequest } from './mockRequest';

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/search/tv**&query=poker+face',
      body: searchPokerFaceResponse,
    });
    await use(page);
  },
});
