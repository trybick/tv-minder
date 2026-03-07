import { createSelector } from '@reduxjs/toolkit';

import { trackApi } from '~/store/rtk/api/track.api';

import {
  selectIsLoggedIn,
  selectUnregisteredTrackedShows,
} from './user.slice';

export const selectTrackedShows = createSelector(
  [
    selectIsLoggedIn,
    selectUnregisteredTrackedShows,
    trackApi.endpoints.getTrackedShows.select(undefined),
  ],
  (isLoggedIn, unregisteredTracks, userTracksQuery) => {
    if (isLoggedIn) {
      return userTracksQuery.data ?? [];
    }
    return unregisteredTracks ?? [];
  }
);

export const selectTrackedShowsSet = createSelector(
  [selectTrackedShows],
  trackedShows => new Set(trackedShows)
);
