import { Selector } from 'react-redux';
import { createSelector } from 'reselect';
import { AppState } from 'store';
import { BasicShowInfo, PopularShow } from 'types/external';
import { selectFollowedShows } from 'store/user/selectors';
import { useGetShowIdFromParams } from 'hooks/useGetShowIdFromParams';
import { mapShowInfoForDisplay } from './tvUtils';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;
export const selectIsLoadingBasicShowInfoForShow = (state: AppState) =>
  state.tv.isLoadingBasicShowInfoForShow;
export const selectCalendarEpisodesForDisplay = (state: AppState) =>
  state.tv.calendarEpisodesForDisplay;
export const selectPopularShows = (state: AppState) => state.tv.popularShows;
export const selectMyShowsTableExpandedRow = (state: AppState) => state.tv.myShowsTableExpandedRow;

export const selectBasicShowInfoForFollowedShows: Selector<AppState, BasicShowInfo[]> =
  createSelector(selectBasicShowInfo, selectFollowedShows, (showInfo, followedShows) => {
    if (!showInfo || !followedShows) {
      return [];
    }
    return Object.values(showInfo)
      .filter(show => followedShows.includes(show.id))
      ?.map<BasicShowInfo>(mapShowInfoForDisplay)
      ?.sort((a, b) => a.name.localeCompare(b.name));
  });

export const selectPopularShowsForDisplay: Selector<AppState, PopularShow[]> = createSelector(
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

export const selectCurrentShowInfo: Selector<AppState, BasicShowInfo> = createSelector(
  selectBasicShowInfo,
  basicShowInfo => {
    const showId = useGetShowIdFromParams();
    const currentShow = basicShowInfo[showId];
    return mapShowInfoForDisplay(currentShow);
  }
);
