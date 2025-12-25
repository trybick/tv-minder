import ky from 'ky';

import ENDPOINTS from '~/app/endpoints';
import { ShowSearchResult } from '~/types/external';
import handleErrors from '~/utils/handleErrors';

export type ReturnedSearchResult = {
  page: number;
  results: ShowSearchResult[];
  total_pages: number;
  total_results: number;
};

let controller: AbortController | null = null;

export const searchShowsByQuery = async (
  query: string
): Promise<{
  results: ShowSearchResult[];
  totalResults: number;
}> => {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();

  const data = await ky
    .get(`${ENDPOINTS.THE_MOVIE_DB}/search/tv`, {
      searchParams: {
        api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY,
        query,
      },
      signal: controller.signal,
    })
    .json<ReturnedSearchResult>()
    .catch(handleErrors);

  return {
    results: data?.results ?? [],
    totalResults: data?.total_results ?? 0,
  };
};
