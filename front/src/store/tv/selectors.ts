import { createSelector } from 'reselect';
import moment from 'moment';
import { AppState } from 'store';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectEpisodeData = (state: AppState) => state.tv.episodeData;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;

export const selectBasicShowInfoForDisplay = createSelector(
  selectBasicShowInfo,
  showsInfo =>
    showsInfo &&
    Object.values(showsInfo)
      ?.map(show => {
        const {
          backdrop_path: backdropPath,
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

        const lastEpisodeForDisplay = {
          airDate: lastEpisodeToAir?.air_date,
          episodeNumber: lastEpisodeToAir?.episode_number,
          name: lastEpisodeToAir?.name,
          overview: lastEpisodeToAir?.overview,
          seasonNumber: lastEpisodeToAir?.season_number,
        };

        const nextEpisodeForDisplay = {
          airDate: nextEpisodeToAir?.air_date,
          episodeNumber: nextEpisodeToAir?.episode_number,
          seasonNumber: nextEpisodeToAir?.season_number,
        };

        return {
          backdropPath,
          id,
          lastAirDate,
          lastEpisodeForDisplay,
          name,
          network: networks[0],
          nextEpisodeForDisplay,
          numEpisodes,
          numSeasons,
          posterPath,
          status,
        };
      })
      ?.sort((a, b) => moment(b.lastAirDate).diff(moment(a.lastAirDate)))
);
