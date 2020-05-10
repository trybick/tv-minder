import axios, { CancelTokenSource } from 'axios';
import { ShowSearchResult } from 'types/external';
import { MOVIE_DB_URL } from 'utils/constants';

//
// Our app calls searchShows
// It uses a request creator for results caching and cancel tokens
//

interface SearchShowData {
  page: number;
  results: ShowSearchResult[];
  total_pages: number;
  total_results: number;
}

type RequestConfig = { api_key: string | undefined; query: string };
type CachedResults = { [query: string]: SearchShowData };

const cachedResults: CachedResults = {};

export const searchShows = async (
  query: string
): Promise<{
  results: ShowSearchResult[];
  totalResults: number;
}> => {
  const emptyResult = { results: [], total_results: 0 };
  const requestConfig: RequestConfig = {
    api_key: process.env.REACT_APP_API_KEY,
    query,
  };

  const { results, total_results: totalResults } =
    (await makeCachedRequest(MOVIE_DB_URL, requestConfig)) || emptyResult;

  return { results, totalResults };
};

const makeCachedRequestCreator = () => {
  let cancelToken: CancelTokenSource;

  return (
    url: string,
    requestConfig: RequestConfig
  ): SearchShowData | Promise<void | SearchShowData> => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    cancelToken = axios.CancelToken.source();

    return cachedResults[requestConfig.query]
      ? cachedResults[requestConfig.query]
      : axios
          .get<SearchShowData>(url, {
            cancelToken: cancelToken.token,
            params: requestConfig,
          })
          .then((res) => {
            const { data } = res;
            cachedResults[requestConfig.query] = data;

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
