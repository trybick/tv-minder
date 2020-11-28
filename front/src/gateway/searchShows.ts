import axios, { CancelTokenSource } from 'axios';
import { ShowSearchResult } from 'types/external';
import { API } from 'constants/api';

//
// Our app calls searchShows
// It uses a request creator for cancel tokens
//

type QueryParams = { api_key: string | undefined; query: string };

export interface ReturnedSearchResult {
  page: number;
  results: ShowSearchResult[];
  total_pages: number;
  total_results: number;
}

const URL = `${API.THE_MOVIE_DB}/search/tv`;

export const searchShows = async (
  query: string
): Promise<{
  results: ShowSearchResult[];
  totalResults: number;
}> => {
  const emptyResult = { results: [], total_results: 0 };
  const queryParams: QueryParams = {
    api_key: process.env.REACT_APP_THE_MOVIE_DB_KEY,
    query,
  };

  const { results, total_results: totalResults } =
    (await makeCancellableRequest(URL, queryParams)) || emptyResult;

  return { results, totalResults };
};

const makeCancellableRequestCreator = () => {
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

const makeCancellableRequest = makeCancellableRequestCreator();
