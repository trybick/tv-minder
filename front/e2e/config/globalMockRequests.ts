import { type Page } from '@playwright/test';

import {
  followResponse,
  moblandBasicInfo,
  moblandSeason1,
  pokerFaceBasicInfo,
  pokerFaceSeason1,
  pokerFaceSeason2,
  searchPokerFaceResponse,
} from '../mockData';
import { discoverShowsResponse } from '../mockData/discoverShows';
import { mockRequest } from '../mockRequest';

const emptyShowsResponse = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export const globalMockRequests = async (page: Page) => {
  // General API mocks (order doesn't matter for these)
  await Promise.all([
    // Discover - Trending/Popular (needs data for tests)
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/trending/tv/week**',
      body: discoverShowsResponse,
    }),

    // Discover - All other carousel endpoints
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/discover/tv**',
      body: emptyShowsResponse,
    }),

    // Search "poker face"
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/search/tv**&query=poker+face',
      body: searchPokerFaceResponse,
    }),

    // TV Minder: follow (matches both localhost:5000 and api.tv-minder.com)
    mockRequest({
      page,
      path: '**/follow',
      body: followResponse,
    }),
  ]);

  // Show-specific mocks - ORDER MATTERS for Playwright route matching
  // More specific paths must be registered BEFORE catch-all patterns

  // Mobland - specific paths MUST come before the catch-all
  await mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/247718/season/**',
    body: moblandSeason1,
  });
  await mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/247718/recommendations**',
    body: emptyShowsResponse,
  });
  await mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/247718**',
    body: moblandBasicInfo,
  });

  // Poker Face - specific paths MUST come before the catch-all
  await mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/120998/season/1**',
    body: pokerFaceSeason1,
  });
  await mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/120998/season/2**',
    body: pokerFaceSeason2,
  });
  await mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/120998/recommendations**',
    body: emptyShowsResponse,
  });
  await mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/120998**',
    body: pokerFaceBasicInfo,
  });
};
