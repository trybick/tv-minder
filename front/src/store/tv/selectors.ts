import { createSelector } from 'reselect';

import { AppSelector, AppState } from '~/store';
import { selectFollowedShows } from '~/store/user/selectors';
import { ID } from '~/types/common';
import { BasicShowInfo, PopularShow } from '~/types/external';

import { mapShowInfoForDisplay } from './tvUtils';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;
export const selectIsLoadingBasicShowInfoForShow = (state: AppState) =>
  state.tv.isLoadingBasicShowInfoForShow;
export const selectCalendarEpisodesForDisplay = (state: AppState) =>
  state.tv.calendarEpisodesForDisplay;
export const selectPopularShows = (state: AppState) => state.tv.popularShows;
export const selectTopRatedShows = (state: AppState) => state.tv.topRatedShows;

export const selectBasicShowInfoForFollowedShows: AppSelector<BasicShowInfo[]> =
  createSelector(
    selectBasicShowInfo,
    selectFollowedShows,
    (showInfo, followedShows) => {
      if (!showInfo || !followedShows) {
        return [];
      }
      return Object.values(showInfo)
        .filter(show => followedShows.includes(show.id))
        ?.map<BasicShowInfo>(mapShowInfoForDisplay)
        ?.sort((a, b) => a.name.localeCompare(b.name));
    }
  );

export const selectActiveSeasonShows: AppSelector<BasicShowInfo[]> =
  createSelector(selectBasicShowInfoForFollowedShows, basicShowInfo =>
    basicShowInfo.filter(
      show => show.statusWithColor.status === 'Active Season'
    )
  );

export const selectInProductionShows: AppSelector<BasicShowInfo[]> =
  createSelector(selectBasicShowInfoForFollowedShows, basicShowInfo =>
    basicShowInfo.filter(
      show => show.statusWithColor.status === 'In Production'
    )
  );

export const selectEndedShows: AppSelector<BasicShowInfo[]> = createSelector(
  selectBasicShowInfoForFollowedShows,
  basicShowInfo =>
    basicShowInfo.filter(show => show.statusWithColor.status === 'Ended')
);

export const selectPopularShowsForDisplay: AppSelector<PopularShow[]> =
  createSelector(
    selectPopularShows,
    shows =>
      shows &&
      Object.values(shows)?.map(show => {
        const { id, fetchedAt, name, poster_path: posterPath } = show;
        return {
          id,
          fetchedAt,
          name,
          posterPath,
        };
      })
  );

export const selectTopRatedShowsForDisplay: AppSelector<PopularShow[]> =
  createSelector(
    selectTopRatedShows,
    shows =>
      shows &&
      Object.values(shows)?.map(show => {
        const { id, fetchedAt, name, poster_path: posterPath } = show;
        return {
          id,
          fetchedAt,
          name,
          posterPath,
        };
      })
  );

export const getCurrentShowId = (): ID => {
  const id = window.location.pathname.split('/')[2];
  if (!id) {
    throw Error('Error finding show ID');
  }
  return +id;
};

export const selectCurrentShowInfo: AppSelector<BasicShowInfo> = createSelector(
  selectBasicShowInfo,
  getCurrentShowId,
  (basicShowInfo, currentShowId) => {
    const currentShow = basicShowInfo[currentShowId];
    return currentShow?.id && mapShowInfoForDisplay(currentShow);
  }
);
