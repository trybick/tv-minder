import { searchShowsByQuery } from '~/store/tv/services/searchShowsByQuery';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';

export const fetchResults = async (
  query: string
): Promise<TmdbShowSummary[]> => {
  const { results } = await searchShowsByQuery(query);
  return results;
};

export const filterOutTrackedShows = (
  results: TmdbShowSummary[],
  trackedIds: Set<number>
): TmdbShowSummary[] => {
  return results.filter(r => !trackedIds.has(r.id)).slice(0, 8);
};
