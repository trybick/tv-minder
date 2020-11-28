import { Selector } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';
import { AppState } from 'store';
import { BasicShowInfo, PopularShow } from 'types/external';

const NUM_EPISODES_IN_ACCORDION = 6;

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectEpisodeData = (state: AppState) => state.tv.episodeData;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;
export const selectCalendarEpisodesForDisplay = (state: AppState) =>
  state.tv.calendarEpisodesForDisplay;
export const selectPopularShows = (state: AppState) => state.tv.popularShows;

export const selectBasicShowInfoForDisplay: Selector<AppState, BasicShowInfo[]> = createSelector(
  selectBasicShowInfo,
  showsInfo =>
    showsInfo &&
    Object.values(showsInfo)?.map(show => {
      const {
        id,
        last_air_date: lastAirDate,
        last_episode_to_air: lastEpisodeToAir,
        name,
        networks,
        next_episode_to_air: nextEpisodeToAir,
        number_of_episodes: numEpisodes,
        number_of_seasons: numSeasons,
        poster_path: posterPath,
        status,
      } = show;

      const lastEpisodeForDisplay = lastEpisodeToAir && {
        airDate: lastEpisodeToAir.air_date,
        episodeNumber: lastEpisodeToAir.episode_number,
        name: lastEpisodeToAir.name,
        overview: lastEpisodeToAir.overview,
        seasonNumber: lastEpisodeToAir.season_number,
      };

      const nextEpisodeForDisplay = nextEpisodeToAir && {
        airDate: nextEpisodeToAir.air_date,
        episodeNumber: nextEpisodeToAir.episode_number,
        name: nextEpisodeToAir.name,
        overview: nextEpisodeToAir.overview,
        seasonNumber: nextEpisodeToAir.season_number,
      };

      const _hasCurrentlyActiveSeason =
        lastEpisodeForDisplay &&
        nextEpisodeForDisplay &&
        moment(nextEpisodeForDisplay.airDate).diff(lastEpisodeForDisplay.airDate, 'days') < 16;
      const statusForDisplay =
        status === 'Ended' ? 'Ended' : _hasCurrentlyActiveSeason ? 'New Episodes' : 'Returning';

      return {
        id,
        lastAirDate,
        lastEpisodeForDisplay,
        name,
        network: networks[0],
        nextEpisodeForDisplay,
        numEpisodes,
        numSeasons,
        posterPath,
        status: statusForDisplay,
      };
    })
);

// Sorted by most recently aired episodes, within past 90 days
export const selectBasicShowInfoForRecentEpisodes = createSelector(
  selectBasicShowInfoForDisplay,
  showsInfo =>
    showsInfo
      ?.filter(show => {
        const daysDiff =
          show.lastEpisodeForDisplay?.airDate &&
          moment(moment()).diff(show.lastEpisodeForDisplay.airDate, 'days');
        return 90 > daysDiff && daysDiff >= 0;
      })
      ?.sort((a, b) =>
        moment(b.lastEpisodeForDisplay.airDate).diff(moment(a.lastEpisodeForDisplay.airDate))
      )
      ?.slice(0, NUM_EPISODES_IN_ACCORDION)
);

// Sorted by upcoming episode date, within next 90 days
export const selectBasicShowInfoForUpcomingEpisodes = createSelector(
  selectBasicShowInfoForDisplay,
  showsInfo =>
    showsInfo
      ?.filter(show => {
        const daysDiff =
          show.nextEpisodeForDisplay?.airDate &&
          moment(moment()).diff(show.nextEpisodeForDisplay.airDate, 'days');
        return 90 > daysDiff && daysDiff <= 0;
      })
      ?.sort((a, b) =>
        moment(a.nextEpisodeForDisplay.airDate).diff(moment(b.nextEpisodeForDisplay.airDate))
      )
      ?.slice(0, NUM_EPISODES_IN_ACCORDION)
);

// Sorted alphabetically
export const selectBasicShowInfoForAllShows = createSelector(
  selectBasicShowInfoForDisplay,
  showsInfo => showsInfo?.sort((a, b) => a.name.localeCompare(b.name))
);

export const selectPopularShowsForDisplay: Selector<AppState, PopularShow[]> = createSelector(
  selectPopularShows,
  shows =>
    shows &&
    Object.values(shows)?.map(show => {
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
