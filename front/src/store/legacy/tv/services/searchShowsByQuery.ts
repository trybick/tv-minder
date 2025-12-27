import { TmdbShowSummary } from '~/store/legacy/tv/types/tmdbSchema';
import { tmdbApi } from '~/store/legacy/tv/utils/tmdbApi';

let controller: AbortController | null = null;

export const searchShowsByQuery = async (
  query: string
): Promise<{
  results: TmdbShowSummary[];
  totalResults: number;
}> => {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();

  try {
    const data = await tmdbApi.search(query, controller.signal);
    return {
      results: data.results,
      totalResults: data.total_results,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { results: [], totalResults: 0 };
    }
    throw error;
  }
};
