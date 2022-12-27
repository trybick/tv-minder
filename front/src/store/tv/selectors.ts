import { Selector } from 'react-redux';
import { createSelector } from 'reselect';
import { AppState } from 'store';
import { BasicShowInfo, PopularShow } from 'types/external';
import { selectFollowedShows } from 'store/user/selectors';
import { mapShowInfoForDisplay } from './tvUtils';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;
export const selectIsLoadingBasicShowInfoForShow = (state: AppState) =>
  state.tv.isLoadingBasicShowInfoForShow;
export const selectCalendarEpisodesForDisplay = (state: AppState) =>
  state.tv.calendarEpisodesForDisplay;
export const selectPopularShows = (state: AppState) => state.tv.popularShows;

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
    Object.values(shows)
      ?.filter(show => show.original_language === 'en')
      .map(show => {
        const {
          id,
          backdrop_path: backdropPath,
          fetchedAt,
          name,
          overview,
          popularity,
          poster_path: posterPath,
          vote_average: voteAverage,
          vote_count: voteCount,
        } = show;
        const voteAverageForDisplay = (voteAverage * 10).toString() + '%';

        return {
          id,
          backdropPath,
          fetchedAt,
          name,
          overview,
          popularity,
          posterPath,
          voteAverage: voteAverageForDisplay,
          voteCount,
        };
      })
);
