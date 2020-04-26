import { MOVIE_DB_URL } from 'utils/constants';
import { makeCachedRequest } from 'gateway/common/makeCachedRequest';

export const searchShows = async (query: string) => {
  const requestConfig = {
    api_key: process.env.REACT_APP_API_KEY,
    query,
  };

  const { results, total_results: totalResults } =
    (await makeCachedRequest(MOVIE_DB_URL, requestConfig)) || {};

  return results ? { results, totalResults } : { results: null };
};
