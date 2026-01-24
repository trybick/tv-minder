import { createSelector } from '@reduxjs/toolkit';

import { type ShowNavigationState } from '~/hooks/useNavigateToShow';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

import { AppSelector, AppState } from './..';
import { PopularShow, ShowForDisplay } from './types/transformed';
import { mapShowInfoForDisplay } from './utils/formatting';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectShowDetails = (state: AppState) => state.tv.showDetails;
export const selectIsLoadingShowDetails = (state: AppState) =>
  state.tv.isLoadingShowDetails;
export const selectCalendarEpisodesForDisplay = (state: AppState) =>
  state.tv.calendarEpisodesForDisplay;
export const selectIsLoadingCalendarEpisodes = (state: AppState) =>
  state.tv.isLoadingCalendarEpisodes;
export const selectPopularShows = (state: AppState) => state.tv.popularShows;
export const selectTopRatedShows = (state: AppState) => state.tv.topRatedShows;

export const selectFollowedShowsDetails: AppSelector<ShowForDisplay[]> =
  createSelector(
    selectShowDetails,
    selectFollowedShows,
    (showDetails, followedShows) => {
      if (!showDetails || !followedShows) {
        return [];
      }
      return Object.values(showDetails)
        .filter(show => followedShows.includes(show.id))
        ?.map<ShowForDisplay>(mapShowInfoForDisplay)
        ?.sort((a, b) => a.name.localeCompare(b.name));
    }
  );

export const selectActiveSeasonShows: AppSelector<ShowForDisplay[]> =
  createSelector(selectFollowedShowsDetails, shows =>
    shows.filter(show => show.status.isActiveSeason)
  );

export const selectInProductionShows: AppSelector<ShowForDisplay[]> =
  createSelector(selectFollowedShowsDetails, shows =>
    shows.filter(show => show.status.isInProduction)
  );

export const selectEndedShows: AppSelector<ShowForDisplay[]> = createSelector(
  selectFollowedShowsDetails,
  shows => shows.filter(show => show.status.isEnded)
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

export const selectCurrentShowInfo: AppSelector<ShowForDisplay | null> =
  createSelector(
    selectShowDetails,
    getShowIdFromUrl,
    (showDetails, currentShowId) => {
      const currentShow = showDetails[currentShowId];
      return currentShow?.id ? mapShowInfoForDisplay(currentShow) : null;
    }
  );

export const selectShowDataFromHistory = createSelector(
  () => window.history.state as ShowNavigationState,
  (historyState): ShowNavigationState | null => {
    if (historyState?.posterSource) {
      return {
        showId: historyState.showId,
        posterSource: historyState.posterSource,
        name: historyState.name,
      };
    }
    return null;
  }
);
