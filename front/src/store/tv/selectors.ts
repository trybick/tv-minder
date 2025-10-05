import { createSelector } from '@reduxjs/toolkit';

import { ShowNavigationState } from '~/features/show/ShowPage';
import { selectFollowedShows } from '~/store/user/selectors';
import { BasicShowInfo, PopularShow } from '~/types/external';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

import { AppSelector, AppState } from './..';
import { mapShowInfoForDisplay } from './tvUtils';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;
export const selectIsLoadingBasicShowInfoForShow = (state: AppState) =>
  state.tv.isLoadingBasicShowInfoForShow;
export const selectIsLoadingCalendarEpisodes = (state: AppState) =>
  state.tv.isLoadingCalendarEpisodes;
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
    selectPopularShows,
    (topRatedShows, popularShows) =>
      topRatedShows &&
      Object.values(topRatedShows)
        // Remove shows that are already in popularShows to avoid duplicate
        // showId viewTransitionName on the same page.
        ?.filter(
          show => !popularShows?.some(popularShow => popularShow.id === show.id)
        )
        ?.map(show => {
          const { id, fetchedAt, name, poster_path: posterPath } = show;
          return {
            id,
            fetchedAt,
            name,
            posterPath,
          };
        })
  );

export const selectCurrentShowInfo: AppSelector<BasicShowInfo | null> =
  createSelector(
    selectBasicShowInfo,
    getShowIdFromUrl,
    (basicShowInfo, currentShowId) => {
      const currentShow = basicShowInfo[currentShowId];
      return currentShow?.id ? mapShowInfoForDisplay(currentShow) : null;
    }
  );

export const selectShowDataFromHistory = createSelector(
  () => window.history.state as ShowNavigationState,
  (historyState): ShowNavigationState | null => {
    if (historyState?.posterSource) {
      return {
        posterSource: historyState.posterSource,
        name: historyState.name,
      };
    }
    return null;
  }
);
