import { test as base, expect, Page } from '@playwright/test';

import { popularShowsResponse } from './mockData';
import { topRatedShowsResponse } from './mockData/topRatedShows';
import { mockRequest } from './mockRequest';

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/trending/tv/week**',
      body: popularShowsResponse,
    });
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/top_rated**',
      body: topRatedShowsResponse,
    });

    await use(page);
  },
});

export { expect };
