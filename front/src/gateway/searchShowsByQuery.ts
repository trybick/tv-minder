import axios, { CancelTokenSource } from 'axios';
import ENDPOINTS from '~/constants/endpoints';
import { ShowSearchResult } from '~/types/external';
import handleErrors from '~/utils/handleErrors';

type QueryParams = { api_key: string | undefined; query: string };

export type ReturnedSearchResult = {
  page: number;
  results: ShowSearchResult[];
  total_pages: number;
  total_results: number;
};

export const searchShowsByQuery = async (
  query: string
): Promise<{
  results: ShowSearchResult[];
  totalResults: number;
}> => {
  const emptyResult = { results: [], total_results: 0 };
  const queryParams: QueryParams = {
    api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY,
    query,
  };

  const { results, total_results: totalResults } =
    (await makeCancellableRequest(
      `${ENDPOINTS.THE_MOVIE_DB}/search/tv`,
      queryParams
    )) || emptyResult;

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
    // eslint-disable-next-line import-x/no-named-as-default-member
    cancelToken = axios.CancelToken.source();

    return axios
      .get<ReturnedSearchResult>(url, {
        cancelToken: cancelToken.token,
        params: queryParams,
      })
      .then(res => res.data)
      .catch(handleErrors);
  };
};

const makeCancellableRequest = makeCancellableRequestCreator();
