import { searchShowsByQuery } from '~/store/tv/services/searchShowsByQuery';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';

export const fetchResults = async (
  query: string
): Promise<TmdbShowSummary[]> => {
  const { results } = await searchShowsByQuery(query);
  return results;
};

export const filterOutFollowedShows = (
  results: TmdbShowSummary[],
  followedIds: Set<number>
): TmdbShowSummary[] => {
  return results.filter(r => !followedIds.has(r.id)).slice(0, 8);
};
