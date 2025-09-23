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
      return userFollowsQuery.data || [];
    }
    return unregisteredFollows;
  }
);

// Boolean selector factory to avoid array reference equality issues in components
export const makeSelectIsShowFollowed =
  (showId: number) =>
  (state: unknown): boolean => {
    if (selectIsLoggedIn(state as any)) {
      const data = userApi.endpoints.getFollowedShows.select(undefined)(
        state as any
      ).data as number[] | undefined;
      return !!data?.includes(showId);
    }
    return selectUnregisteredFollowedShows(state as any).includes(showId);
  };
