import axios, { CancelTokenSource } from 'axios';
import { ShowSearchResult } from 'types/external';
import { API_URLS } from 'utils/constants';

//
// Our app calls searchShows
// It uses a request creator for results caching and cancel tokens
//

type QueryParams = { api_key: string | undefined; query: string };

export interface ReturnedSearchResult {
  page: number;
  results: ShowSearchResult[];
  total_pages: number;
  total_results: number;
}

const url = `${API_URLS.MOVIE_DB}/search/tv`;

export const searchShows = async (
  query: string
): Promise<{
  results: ShowSearchResult[];
  totalResults: number;
}> => {
  const emptyResult = { results: [], total_results: 0 };
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_MOVIE_DB_KHEE,
    query,
  };

  const { results, total_results: totalResults } =
    (await makeCachedRequest(url, queryParams)) || emptyResult;

  return { results, totalResults };
};

const makeCachedRequestCreator = () => {
  let cancelToken: CancelTokenSource;

  return (
    url: string,
    queryParams: QueryParams
  ): ReturnedSearchResult | Promise<void | ReturnedSearchResult> => {
    if (cancelToken) {
      cancelToken.cancel();
    }
    cancelToken = axios.CancelToken.source();

    return axios
      .get<ReturnedSearchResult>(url, {
        cancelToken: cancelToken.token,
        params: queryParams,
      })
      .then(res => res.data)
      .catch((err: Error) => {
        if (!axios.isCancel(err)) {
          console.log('Axios error', err.message);
        }
      });
  };
};

const makeCachedRequest = makeCachedRequestCreator();
