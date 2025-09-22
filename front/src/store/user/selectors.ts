import { createSelector } from '@reduxjs/toolkit';

import { RootState } from './..';
import { userApi } from './user.api';
import {
  selectIsLoggedIn,
  selectUnregisteredFollowedShows,
} from './user.slice';

export const selectFollowedShows = createSelector(
  [
    selectIsLoggedIn,
    selectUnregisteredFollowedShows,
    (state: RootState) =>
      userApi.endpoints.getFollowedShows.select(undefined)(state),
  ],
  (isLoggedIn, unregisteredFollows, userFollowsQuery) => {
    if (isLoggedIn) {
      return userFollowsQuery.data?.followedShows || [];
    }
    return unregisteredFollows;
  }
);
