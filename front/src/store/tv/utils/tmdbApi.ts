import * as Sentry from '@sentry/react';
import { type, type Type } from 'arktype';
import ky, { type Options } from 'ky';

import { ENDPOINTS } from '~/app/endpoints';
import {
  tmdbSchema,
  type TmdbSearchResult,
  type TmdbSeason,
  type TmdbShow,
  type TmdbShowList,
} from '~/store/tv/types/tmdbSchema';

const api = ky.create({
  prefixUrl: ENDPOINTS.THE_MOVIE_DB,
  searchParams: { api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY },
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
   * Get top rated TV shows.
   * Endpoint: /tv/top_rated
   */
  getTopRated: (): Promise<TmdbShowList> =>
    fetchTmdb('tv/top_rated', tmdbSchema.showList),

  /**
   * Get similar TV shows based on a show ID.
   * Endpoint: /tv/{series_id}/similar
   * NOTE: This seems to give not useful results that don't seem similar.
   */
  getSimilar: (showId: number): Promise<TmdbShowList> =>
    fetchTmdb(`tv/${showId}/similar`, tmdbSchema.showList),

  /**
   * Get recommended TV shows based on a show ID.
   * Endpoint: /tv/{series_id}/recommendations
   */
  getRecommendations: (showId: number): Promise<TmdbShowList> =>
    fetchTmdb(`tv/${showId}/recommendations`, tmdbSchema.showList),
};
