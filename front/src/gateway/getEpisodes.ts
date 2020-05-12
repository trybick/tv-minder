import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';

type QueryParams = {
  api_key: string | undefined;
};

// Get the number of seasons in a show (needed for other requests)
export const getNumberSeasons = async (showId: number) => {
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
      return data;
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
