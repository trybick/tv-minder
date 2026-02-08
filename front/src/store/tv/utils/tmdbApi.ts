import * as Sentry from '@sentry/react';
import { type, type Type } from 'arktype';
import { type Dayjs } from 'dayjs';
import ky, { type Options } from 'ky';

import { ENDPOINTS } from '~/app/endpoints';
import {
  tmdbSchema,
  type TmdbSearchResult,
  type TmdbSeason,
  type TmdbShow,
  type TmdbShowList,
} from '~/store/tv/types/tmdbSchema';
import { dayjs } from '~/utils/dayjs';

const api = ky.create({
  prefixUrl: ENDPOINTS.THE_MOVIE_DB,
  searchParams: { api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY },
  // May need these headers to fix some requests not caching in service worker
  // headers: {
  //   'Accept-Encoding': 'gzip, deflate, br',
  // },
});

/**
 * Generic fetcher that validates response against an arktype schema.
 * Logs to Sentry if validation fails.
 */
async function fetchTmdb<T extends Type>(
  path: string,
  schema: T,
  options?: Options
) {
  const data = await api.get(path, options).json();
  const result = schema(data);

  if (result instanceof type.errors) {
    const error = new Error(
      `TMDB API validation failed for ${path}: ${result.summary}`
    );
    console.error(error);
    Sentry.captureException(error, {
      extra: { path, validationErrors: result.summary },
    });
  }

  return result as T['infer'];
}

/**
 * Typed TMDB API client with automatic validation.
 * All methods return validated, properly typed data.
 */
export const tmdbApi = {
  /**
   * Get detailed show info by ID.
   * Endpoint: /tv/{id}
   */
  getShow: (id: number): Promise<TmdbShow> =>
    fetchTmdb(`tv/${id}`, tmdbSchema.show, {
      searchParams: { append_to_response: 'videos' },
    }),

  /**
   * Get season details with episodes.
   * Endpoint: /tv/{showId}/season/{seasonNumber}
   */
  getSeason: (showId: number, seasonNumber: number): Promise<TmdbSeason> =>
    fetchTmdb(`tv/${showId}/season/${seasonNumber}`, tmdbSchema.season),

  /**
   * Search for TV shows by string.
   * Endpoint: /search/tv
   */
  search: (query: string, signal: AbortSignal): Promise<TmdbSearchResult> =>
    fetchTmdb('search/tv', tmdbSchema.searchResult, {
      searchParams: { query },
      signal,
    }),

  /**
   * Get trending TV shows.
   * Endpoint: /trending/tv/week
   */
  getTrending: (): Promise<TmdbShowList> =>
    fetchTmdb('trending/tv/week', tmdbSchema.showList),

  /**
   * Get recommended TV shows based on a show ID.
   * Endpoint: /tv/{series_id}/recommendations
   */
  getRecommendations: (showId: number): Promise<TmdbShowList> =>
    fetchTmdb(`tv/${showId}/recommendations`, tmdbSchema.showList),

  // ─────────────────────────────────────────────────────────────
  // DISCOVER ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  /**
   * Discover English shows currently airing (within the last 7 days).
   * Endpoint: /discover/tv with air_date filters
   */
  discoverAiringThisWeek: (): Promise<TmdbShowList> => {
    const today = dayjs();
    const weekAgo = today.subtract(7, 'day');
    const isoDate = (d: Dayjs) => d.format('YYYY-MM-DD');
    return fetchTmdb('discover/tv', tmdbSchema.showList, {
      searchParams: {
        with_original_language: 'en',
        sort_by: 'popularity.desc',
        'air_date.gte': isoDate(weekAgo),
        'air_date.lte': isoDate(today),
      },
    });
  },

  /**
   * Discover new English shows that premiered in the last year.
   * Endpoint: /discover/tv with first_air_date filter
   */
  discoverNewShows: (): Promise<TmdbShowList> => {
    const oneYearAgo = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
    return fetchTmdb('discover/tv', tmdbSchema.showList, {
      searchParams: {
        with_original_language: 'en',
        sort_by: 'popularity.desc',
        'first_air_date.gte': oneYearAgo,
      },
    });
  },

  /**
   * Discover shows premiering in the next 30 days.
   * Endpoint: /discover/tv with first_air_date filter
   */
  discoverComingSoon: (): Promise<TmdbShowList> => {
    const today = dayjs();
    const thirtyDaysFromNow = today.add(30, 'day');
    const isoDate = (d: Dayjs) => d.format('YYYY-MM-DD');
    return fetchTmdb('discover/tv', tmdbSchema.showList, {
      searchParams: {
        with_original_language: 'en',
        sort_by: 'popularity.desc',
        'first_air_date.gte': isoDate(today),
        'first_air_date.lte': isoDate(thirtyDaysFromNow),
      },
    });
  },

  /**
   * Discover shows returning with new seasons this month.
   * Endpoint: /discover/tv with air_date filter
   */
  discoverReturningThisMonth: (): Promise<TmdbShowList> => {
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    const endOfMonth = today.endOf('month');
    const isoDate = (d: Dayjs) => d.format('YYYY-MM-DD');
    return fetchTmdb('discover/tv', tmdbSchema.showList, {
      searchParams: {
        with_original_language: 'en',
        sort_by: 'popularity.desc',
        'air_date.gte': isoDate(startOfMonth),
        'air_date.lte': isoDate(endOfMonth),
        'first_air_date.lte': isoDate(startOfMonth.subtract(1, 'year')),
      },
    });
  },

  /**
   * Discover most rated English shows (by vote count).
   * Endpoint: /discover/tv sorted by vote_count
   */
  discoverMostRated: (): Promise<TmdbShowList> =>
    fetchTmdb('discover/tv', tmdbSchema.showList, {
      searchParams: {
        with_original_language: 'en',
        sort_by: 'vote_count.desc',
        'vote_count.gte': 100,
      },
    }),

  /**
   * Discover highest rated English shows (by vote average).
   * Endpoint: /discover/tv sorted by vote_average
   */
  discoverHighestRated: (): Promise<TmdbShowList> =>
    fetchTmdb('discover/tv', tmdbSchema.showList, {
      searchParams: {
        with_original_language: 'en',
        sort_by: 'vote_average.desc',
        'vote_count.gte': 200,
      },
    }),

  /**
   * Discover shows by network ID.
   * Network IDs: 213 (Netflix), 49 (HBO), 2739 (Disney+), 2552 (Apple TV+)
   * Endpoint: /discover/tv with with_networks filter
   */
  discoverByNetwork: (networkId: number): Promise<TmdbShowList> =>
    fetchTmdb('discover/tv', tmdbSchema.showList, {
      searchParams: {
        with_networks: networkId,
        sort_by: 'popularity.desc',
      },
    }),

  /**
   * Discover shows by genre ID.
   * Genre IDs: 10759 (Action), 18 (Drama), 10765 (Sci-Fi), 99 (Documentary)
   * Endpoint: /discover/tv with with_genres filter
   * Fetches 2 pages to get more results after deduplication
   */
  discoverByGenre: async (genreId: number): Promise<TmdbShowList> => {
    if (genreId === 99) {
      return fetchTmdb('discover/tv', tmdbSchema.showList, {
        searchParams: {
          with_original_language: 'en',
          with_genres: genreId,
          sort_by: 'popularity.desc',
        },
      });
    } else {
      const [page1, page2] = await Promise.all([
        fetchTmdb('discover/tv', tmdbSchema.showList, {
          searchParams: {
            with_original_language: 'en',
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page: 1,
          },
        }),
        fetchTmdb('discover/tv', tmdbSchema.showList, {
          searchParams: {
            with_original_language: 'en',
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page: 2,
          },
        }),
      ]);

      return {
        ...page1,
        results: [...page1.results, ...page2.results],
      };
    }
  },
};
