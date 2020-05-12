import axios from 'axios';
import { MOVIE_DB_BASE_URL } from 'utils/constants';

type QueryParams = {
  api_key: string | undefined;
};

export const getSeasonEpisodes = async (showId: number, seasonNumber: number) => {
  const url = `${MOVIE_DB_BASE_URL}/tv/${showId}/season/${seasonNumber}`;
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
  };

  const response = await axios
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

  return response;
};
