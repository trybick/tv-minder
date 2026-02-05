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
import { popularShowsResponse } from '../mockData/popularShows';
import { topRatedShowsResponse } from '../mockData/topRatedShows';
import { mockRequest } from '../mockRequest';

export const globalMockRequests = async (page: Page) => {
  await Promise.all([
    // Popular
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/trending/tv/week**',
      body: popularShowsResponse,
    }),

    // Top rated
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/top_rated**',
      body: topRatedShowsResponse,
    }),

    // Search "poker face"
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/search/tv**&query=poker+face',
      body: searchPokerFaceResponse,
    }),

    // Mobland
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/247718*',
      body: moblandBasicInfo,
    }),
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/247718/season/1**',
      body: moblandSeason1,
    }),

    // Poker Face
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/120998*',
      body: pokerFaceBasicInfo,
    }),
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/120998/season/1**',
      body: pokerFaceSeason1,
    }),
    mockRequest({
      page,
      path: '/api.themoviedb.org/3/tv/120998/season/2**',
      body: pokerFaceSeason2,
    }),

    // TV Minder: follow (matches both localhost:5000 and api.tv-minder.com)
    mockRequest({
      page,
      path: '**/follow',
      body: followResponse,
    }),
  ]);
};
