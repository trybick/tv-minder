import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSelector } from '@reduxjs/toolkit';

import { dayjs } from '~/utils/dayjs';
import { cacheDurationDays } from '~/utils/cacheDurations';
import { tmdbApi } from '~/store/tv/utils/tmdbApi';
import { TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { PopularShow } from '~/store/tv/types/transformed';

// === Types ===

export type PopularShowCached = TmdbShowSummary & {
  fetchedAt: string;
};

// === API Definition ===

/**
 * RTK Query API for TMDB endpoints.
 * Uses fakeBaseQuery since we have a custom tmdbApi client with validation.
 */
export const tmdbRtkApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['PopularShows', 'TopRatedShows'],
  endpoints: builder => ({
    // Popular/Trending Shows
    getPopularShows: builder.query<PopularShowCached[], void>({
      queryFn: async () => {
        try {
          const data = await tmdbApi.getTrending();
          const dataWithTimestamp: PopularShowCached[] = data.results.map(
            show => ({
              ...show,
              fetchedAt: dayjs().toISOString(),
            })
          );
          return { data: dataWithTimestamp };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      providesTags: ['PopularShows'],
      // Demonstrate onQueryStarted - useful for side effects, logging, etc.
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Example: you could dispatch other actions, log, or do analytics here
          console.debug(`[tmdbApi] Fetched ${data.length} popular shows`);
        } catch (err) {
          // Handle errors - could dispatch error actions, show toasts, etc.
          console.error('[tmdbApi] Failed to fetch popular shows:', err);
        }
      },
      // Keep cached data for the duration specified in cacheDurationDays
      keepUnusedDataFor: cacheDurationDays.popularShows * 24 * 60 * 60, // Convert days to seconds
    }),

    // Top Rated Shows
    getTopRatedShows: builder.query<PopularShowCached[], void>({
      queryFn: async () => {
        try {
          const data = await tmdbApi.getTopRated();
          const dataWithTimestamp: PopularShowCached[] = data.results.map(
            show => ({
              ...show,
              fetchedAt: dayjs().toISOString(),
            })
          );
          return { data: dataWithTimestamp };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          };
        }
      },
      providesTags: ['TopRatedShows'],
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.debug(`[tmdbApi] Fetched ${data.length} top rated shows`);
        } catch (err) {
          console.error('[tmdbApi] Failed to fetch top rated shows:', err);
        }
      },
      keepUnusedDataFor: cacheDurationDays.popularShows * 24 * 60 * 60,
    }),
  }),
});

// === Hooks ===

export const { useGetPopularShowsQuery, useGetTopRatedShowsQuery } = tmdbRtkApi;

// === Selectors ===

// Base selectors that extract data from RTK Query cache
const selectPopularShowsResult =
  tmdbRtkApi.endpoints.getPopularShows.select();
const selectTopRatedShowsResult =
  tmdbRtkApi.endpoints.getTopRatedShows.select();

/**
 * Transform popular shows to display format
 */
export const selectPopularShowsForDisplay = createSelector(
  selectPopularShowsResult,
  result =>
    result.data?.map(
      (show): PopularShow => ({
        id: show.id,
        fetchedAt: show.fetchedAt,
        name: show.name,
        posterPath: show.poster_path,
      })
    ) ?? []
);

/**
 * Transform top rated shows to display format, filtering out duplicates from popular shows
 */
export const selectTopRatedShowsForDisplay = createSelector(
  selectTopRatedShowsResult,
  selectPopularShowsResult,
  (topRatedResult, popularResult): PopularShow[] => {
    const topRatedShows = topRatedResult.data ?? [];
    const popularShows = popularResult.data ?? [];

    // Remove shows that are already in popularShows to avoid duplicate
    // showId viewTransitionName on the same page.
    return topRatedShows
      .filter(show => !popularShows.some(popularShow => popularShow.id === show.id))
      .map(show => ({
        id: show.id,
        fetchedAt: show.fetchedAt,
        name: show.name,
        posterPath: show.poster_path,
      }));
  }
);

// === Advanced Pattern: Manual Cache Check ===

/**
 * If you need the old pattern of checking cache staleness before fetching,
 * you can use this approach with selectFromResult in components.
 *
 * Example usage in a component:
 *
 * const { data, isStale, refetch } = useGetPopularShowsQuery(undefined, {
 *   selectFromResult: ({ data, ...rest }) => ({
 *     ...rest,
 *     data,
 *     isStale: isCacheStale(data, cacheDurationDays.popularShows),
 *   }),
 * });
 *
 * useEffect(() => {
 *   if (isStale) refetch();
 * }, [isStale, refetch]);
 */
export const isCacheStale = (
  data: PopularShowCached[] | undefined,
  cacheDays: number
): boolean => {
  if (!data?.length) return true;
  const firstShow = data[0];
  const cacheAge = firstShow?.fetchedAt
    ? dayjs().diff(dayjs(firstShow.fetchedAt), 'day')
    : Infinity;
  return cacheAge >= cacheDays;
};
