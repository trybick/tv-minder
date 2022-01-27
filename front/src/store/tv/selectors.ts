import { Selector } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';
import { AppState } from 'store';
import { BasicShowInfo, Genre, PopularShow } from 'types/external';
import { getStatusWithColor, getVideoTrailerKey } from './tvUtils';
import {
  addLeadingZero,
  getTimeFromNowForLastAired,
  getTimeFromNowForNextAiring,
} from 'utils/formatting';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectEpisodeData = (state: AppState) => state.tv.episodeData;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;
export const selectCalendarEpisodesForDisplay = (state: AppState) =>
  state.tv.calendarEpisodesForDisplay;
export const selectPopularShows = (state: AppState) => state.tv.popularShows;

export const selectBasicShowInfoForDisplay: Selector<AppState, BasicShowInfo[]> = createSelector(
  selectBasicShowInfo,
  showInfo =>
    showInfo &&
    Object.values(showInfo)
      ?.map<BasicShowInfo>(show => {
        const {
          backdrop_path: backdropPath,
          created_by: createdBy,
          episode_run_time: episodeRunTime,
          first_air_date: firstAirDate,
          genres,
          id,
          in_production: inProduction,
          last_air_date: lastAirDate,
          last_episode_to_air: lastEpisodeToAir,
          name,
          networks,
          next_episode_to_air: nextEpisodeToAir,
          number_of_episodes: numEpisodes,
          number_of_seasons: numSeasons,
          overview,
          poster_path: posterPath,
          spoken_languages: spokenLanuages,
          status,
          tagline,
          videos,
          vote_average: voteAverage,
          vote_count: voteCount,
        } = show;

        const lastEpisodeForDisplay = lastEpisodeToAir && {
          airDate: lastEpisodeToAir.air_date,
          daysDiff: moment(moment().startOf('day')).diff(lastEpisodeToAir.air_date, 'days'),
          episodeNumber: addLeadingZero(lastEpisodeToAir.episode_number),
          name: lastEpisodeToAir.name,
          overview: lastEpisodeToAir.overview,
          seasonNumber: addLeadingZero(lastEpisodeToAir.season_number),
          timeFromNow: getTimeFromNowForLastAired(lastEpisodeToAir?.air_date),
        };

        const nextEpisodeForDisplay = nextEpisodeToAir && {
          airDate: nextEpisodeToAir.air_date,
          daysDiff: Math.abs(moment().startOf('day').diff(nextEpisodeToAir.air_date, 'days')),
          episodeNumber: addLeadingZero(nextEpisodeToAir.episode_number),
          name: nextEpisodeToAir.name,
          overview: nextEpisodeToAir.overview,
          seasonNumber: addLeadingZero(nextEpisodeToAir.season_number),
          timeFromNow: getTimeFromNowForNextAiring(nextEpisodeToAir?.air_date),
        };

        const statusWithColor = getStatusWithColor(
          status,
          lastEpisodeForDisplay,
          nextEpisodeForDisplay
        );

        const genreNames: string[] = genres.slice(0, 2).map((genre: Genre) => genre.name);

        return {
          backdropPath,
          createdBy: createdBy[0]?.name,
          episodeRunTime: episodeRunTime.length && episodeRunTime[0],
          firstAirDate,
          genreNames,
          language: spokenLanuages[0]?.english_name,
          id,
          inProduction,
          lastAirDate,
          lastEpisodeForDisplay,
          name,
          network: networks[0]?.name,
          nextEpisodeForDisplay,
          numEpisodes,
          numSeasons,
          overview,
          posterPath,
          statusWithColor,
          tagline,
          videoTrailerKey: getVideoTrailerKey(videos),
          voteAverage,
          voteCount,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name))
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
