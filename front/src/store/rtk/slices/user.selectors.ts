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
      return userFollowsQuery.data || [];
    }
    return unregisteredFollows;
  }
);

export const makeSelectIsShowFollowed = (showId: number) =>
  createSelector([selectFollowedShows], followedShows =>
    followedShows.includes(showId)
  );
