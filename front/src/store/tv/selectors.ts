import { createSelector } from 'reselect';
import { AppState } from 'store';

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;
export const selectEpisodeData = (state: AppState) => state.tv.episodeData;
export const selectBasicShowInfo = (state: AppState) => state.tv.basicShowInfo;

export const selectBasicShowInfoForDisplay = createSelector(selectBasicShowInfo, showsInfo =>
  Object.values(showsInfo).map(show => ({
    backdropPath: show.backdrop_path,
    id: show.id,
    lastAirDate: show.last_air_date,
    lastEpisodeToAir: show.last_episode_to_air,
    name: show.name,
    nextEpisodeToAir: show.next_episode_to_air,
    numEpisodes: show.number_of_episodes,
    numSeasons: show.number_of_seasons,
    posterPath: show.poster_path,
    status: show.status,
  }))
);
