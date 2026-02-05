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
import { topRatedShowsResponse } from '../mockData/topRatedShows';
import { mockRequest } from '../mockRequest';

const emptyShowsResponse = {
  page: 1,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export const globalMockRequests = async (page: Page) => {
  await Promise.all([
    // Trending
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/trending/tv/week**',
      body: discoverShowsResponse,
    }),

    // Top rated
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/top_rated**',
      body: topRatedShowsResponse,
    }),

    // Discover (all variations) - returns empty to avoid unmocked calls
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

    // TV Minder: follow
    mockRequest({
      page,
      path: '**/follow',
      body: followResponse,
    }),
  ]);

  // Show-specific mocks - ORDER MATTERS for Playwright route matching
  // More specific paths must be registered BEFORE catch-all patterns

  // Mobland
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

  // Poker Face
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
