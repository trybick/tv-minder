import { createSelector } from '@reduxjs/toolkit';

import { userApi } from '~/store/api/endpoints/user.api';

import {
  selectIsLoggedIn,
  selectUnregisteredFollowedShows,
} from './user.slice';

export const selectFollowedShows = createSelector(
  [
    selectIsLoggedIn,
    selectUnregisteredFollowedShows,
    userApi.endpoints.getFollowedShows.select(undefined),
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
