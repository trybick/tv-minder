import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';

type QueryParams = {
  api_key: string | undefined;
};

export const getSchedule = async (showId: number) => {
  const seasonsToFetch = await getActiveSeasons(showId);
  console.log('seasonsToFetch:', seasonsToFetch);

  // NEXT call getSeasonEpisodes here with the active seasons
};

// Get the season number of the latest and next episodes to air
export const getActiveSeasons = async (showId: number) => {
  const url = `${MOVIE_DB_BASE_URL}/tv/${showId}`;
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
  };

  return await axios
    .get(url, {
      params: queryParams,
    })
    .then((res) => {
      const { data } = res;
      const lastSeasonNumberToAir = data.last_episode_to_air?.season_number || null;
      const nextSeasonNumberToAir = data.next_episode_to_air?.season_number || null;
      const activeSeasons = [lastSeasonNumberToAir, nextSeasonNumberToAir];

      return activeSeasons;
    })
    .catch((err: Error) => {
      console.log('Axios error', err.message);
    });
};

// Get full episode details for one season
export const getSeasonEpisodes = async (showId: number, seasonNumber: number) => {
  const url = `${MOVIE_DB_BASE_URL}/tv/${showId}/season/${seasonNumber}`;
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
  };

  return await axios
    .get(url, {
      params: queryParams,
    })
    .then((res) => {
      const { data } = res;

      return data;
    })
    .catch((err: Error) => {
      console.log('Axios error', err.message);
    });
};
