import { type useAppDispatch } from '~/store';
import { saveSearchQueryAction } from '~/store/tv/actions';
import { searchShowsByQuery } from '~/store/tv/services/searchShowsByQuery';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { type SavedQuery } from '~/store/tv/types/transformed';
import { cacheDurationDays } from '~/utils/cacheDurations';
import { dayjs } from '~/utils/dayjs';

export const findCachedQuery = (
  savedQueries: SavedQuery[],
  query: string
): SavedQuery | undefined => {
  const cached = savedQueries.find(q => q.query === query);
  if (!cached) {
    return undefined;
  }
  const isExpired =
    dayjs().diff(dayjs(cached.timeSaved), 'day') >= cacheDurationDays.search;
  return isExpired ? undefined : cached;
};

export const fetchAndCacheResults = async (
  query: string,
  dispatch: ReturnType<typeof useAppDispatch>
): Promise<TmdbShowSummary[]> => {
  const { results, totalResults } = await searchShowsByQuery(query);
  dispatch(
    saveSearchQueryAction({
      query,
      results,
      timeSaved: dayjs().toISOString(),
      totalResults,
    })
  );
  return results;
};

export const filterOutFollowedShows = (
  results: TmdbShowSummary[],
  followedIds: Set<number>
): TmdbShowSummary[] => {
  return results.filter(r => !followedIds.has(r.id)).slice(0, 8);
};
