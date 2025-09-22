import { createSelector } from '@reduxjs/toolkit';

import { userApi } from './user.api';
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
      return userFollowsQuery.data?.followedShows || [];
    }
    return unregisteredFollows;
  }
);
