import { createSelector } from 'reselect';
import { AppState } from 'store';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectEpisodeData = (state: AppState) => state.tv.episodeData;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;

export const selectBasicShowInfoForDisplay = createSelector(selectBasicShowInfo, showsInfo =>
  Object.values(showsInfo).map(show => {
    const {
      backdrop_path: backdropPath,
      id,
      last_air_date: lastAirDate,
      last_episode_to_air: lastEpisodeToAir,
      name,
      next_episode_to_air: nextEpisodeToAir,
      number_of_episodes: numEpisodes,
      number_of_seasons: numSeasons,
      poster_path: posterPath,
      status,
    } = show;

    const lastEpisodeForDisplay = {
      airDate: lastEpisodeToAir.air_date,
      episodeNumber: lastEpisodeToAir.episode_number,
      seasonNumber: lastEpisodeToAir.season_number,
    };

    return {
      backdropPath,
      id,
      lastAirDate,
      lastEpisodeForDisplay,
      name,
      nextEpisodeToAir,
      numEpisodes,
      numSeasons,
      posterPath,
      status,
    };
  })
);
