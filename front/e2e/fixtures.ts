import { test as base, expect, Page } from '@playwright/test';

import {
  followResponse,
  popularShowsResponse,
  searchPokerFaceResponse,
} from './mockData/mockData';
import { topRatedShowsResponse } from './mockData/topRatedShows';
import { mockRequest } from './mockRequest';

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    // Popular
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/trending/tv/week**',
      body: popularShowsResponse,
    });

    // Top rated
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/top_rated**',
      body: topRatedShowsResponse,
    });

    // Search "poker face"
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/search/tv**&query=poker+face',
      body: searchPokerFaceResponse,
    });

    // TV Minder: follow
    mockRequest({
      page,
      path: '/api.tv-minder.com/follow*',
      body: followResponse,
    });

    await use(page);
  },
});

export { expect };
