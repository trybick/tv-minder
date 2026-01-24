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

export const globalMockRequests = (page: Page) => {
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

  // Mobland
  mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/247718*',
    body: moblandBasicInfo,
  });
  mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/247718/season/1**',
    body: moblandSeason1,
  });

  // Poker Face
  mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/120998*',
    body: pokerFaceBasicInfo,
  });
  mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/120998/season/1**',
    body: pokerFaceSeason1,
  });
  mockRequest({
    page,
    path: '/api.themoviedb.org/3/tv/120998/season/2**',
    body: pokerFaceSeason2,
  });

  // TV Minder: follow
  mockRequest({
    page,
    path: '/api.tv-minder.com/follow*',
    body: followResponse,
  });
};
