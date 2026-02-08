import { createSelector } from '@reduxjs/toolkit';

import { followApi } from '~/store/rtk/api/follow.api';

import {
  selectIsLoggedIn,
  selectUnregisteredFollowedShows,
} from './user.slice';

export const selectFollowedShows = createSelector(
  [
    selectIsLoggedIn,
    selectUnregisteredFollowedShows,
    followApi.endpoints.getFollowedShows.select(undefined),
  ],
  (isLoggedIn, unregisteredFollows, userFollowsQuery) => {
    if (isLoggedIn) {
      return userFollowsQuery.data ?? [];
    }
    return unregisteredFollows ?? [];
  }
);

export const selectFollowedShowsSet = createSelector(
  [selectFollowedShows],
  followedShows => new Set(followedShows)
);
