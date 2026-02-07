import { type useAppDispatch } from '~/store';
import { saveSearchQueryAction } from '~/store/tv/actions';
import { searchShowsByQuery } from '~/store/tv/services/searchShowsByQuery';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { type SavedQuery } from '~/store/tv/types/transformed';

export const findCachedQuery = (
  savedQueries: SavedQuery[],
  query: string
): SavedQuery | undefined => {
  return savedQueries.find(q => q.query === query);
};

export const fetchAndCacheResults = async (
  query: string,
  dispatch: ReturnType<typeof useAppDispatch>
): Promise<TmdbShowSummary[]> => {
  const { results, totalResults } = await searchShowsByQuery(query);
  dispatch(saveSearchQueryAction({ query, results, totalResults }));
  return results;
};

export const filterOutFollowedShows = (
  results: TmdbShowSummary[],
  followedIds: Set<number>
): TmdbShowSummary[] => {
  return results.filter(r => !followedIds.has(r.id)).slice(0, 8);
};
