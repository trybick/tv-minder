import axios, { CancelTokenSource } from 'axios';
import { ShowSearchResult } from 'types/external';
import { MOVIE_DB_BASE_URL } from 'utils/constants';

//
// Our app calls searchShows
// It uses a request creator for results caching and cancel tokens
//

interface ReturnedData {
  page: number;
  results: ShowSearchResult[];
  total_pages: number;
  total_results: number;
}

type QueryParams = { api_key: string | undefined; query: string };
type CachedResults = { [query: string]: ReturnedData };

const url = `${MOVIE_DB_BASE_URL}/search/tv`;
const cachedResults: CachedResults = {};

export const searchShows = async (
  query: string
): Promise<{
  results: ShowSearchResult[];
  totalResults: number;
}> => {
  const emptyResult = { results: [], total_results: 0 };
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_API_KEY,
    query,
  };

  const { results, total_results: totalResults } =
    (await makeCachedRequest(url, queryParams)) || emptyResult;

  return { results, totalResults };
};

const makeCachedRequestCreator = () => {
  let cancelToken: CancelTokenSource;

  return (url: string, queryParams: QueryParams): ReturnedData | Promise<void | ReturnedData> => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    cancelToken = axios.CancelToken.source();

    return cachedResults[queryParams.query]
      ? cachedResults[queryParams.query]
      : axios
          .get<ReturnedData>(url, {
            cancelToken: cancelToken.token,
            params: queryParams,
          })
          .then((res) => {
            const { data } = res;
            cachedResults[queryParams.query] = data;

            return data;
          })
          .catch((err: Error) => {
            if (!axios.isCancel(err)) {
              console.log('Axios error', err.message);
            }
          });
  };
};

const makeCachedRequest = makeCachedRequestCreator();
