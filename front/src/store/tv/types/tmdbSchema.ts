import { type } from 'arktype';

/**
 * /tv/{show_id} response
 */
const show = type({
  id: 'number',
  name: 'string',
  status: 'string',
  last_air_date: 'string | null',
  first_air_date: 'string | null',
  backdrop_path: 'string | null',
  poster_path: 'string | null',
  overview: 'string',
  vote_average: 'number',
  vote_count: 'number',
  'genres?': type({ id: 'number', name: 'string' }).array(),
  'networks?': type({
    id: 'number',
    name: 'string',
    logo_path: 'string | null',
  }).array(),
  'seasons?': type({
    season_number: 'number',
    episode_count: 'number',
    air_date: 'string | null',
    id: 'number',
    name: 'string',
    overview: 'string',
    poster_path: 'string | null',
  }).array(),
  'episode_run_time?': 'number[]',
  'last_episode_to_air?': type({
    season_number: 'number',
    episode_number: 'number',
    air_date: 'string',
    id: 'number',
    name: 'string',
  }).or('null'),
  'next_episode_to_air?': type({
    season_number: 'number',
    episode_number: 'number',
    air_date: 'string',
    id: 'number',
    name: 'string',
  }).or('null'),
  'videos?': type({
    'id?': 'number',
    results: type({
      key: 'string',
      type: 'string',
      site: 'string',
      name: 'string',
      'official?': 'boolean',
      'published_at?': 'string',
    }).array(),
  }),
  'spoken_languages?': type({
    english_name: 'string',
    iso_639_1: 'string',
    name: 'string',
  }).array(),
});

export type TmdbShow = typeof show.infer;

/**
 * /tv/{show_id}/videos response
 */
const showVideos = type({
  id: 'number',
  results: type({
    key: 'string',
    type: 'string',
    site: 'string',
    name: 'string',
    'official?': 'boolean',
    'published_at?': 'string',
  }).array(),
});

export type TmdbShowVideos = typeof showVideos.infer;

/**
 * /tv/{show_id}/reviews response
 */
const showReview = type({
  id: 'string',
  author: 'string',
  content: 'string',
  url: 'string',
  created_at: 'string',
  updated_at: 'string',
});

const showReviews = type({
  id: 'number',
  page: 'number',
  'results?': showReview.array(),
});

export type TmdbShowReviews = typeof showReviews.infer;

/**
 * /tv/{show_id}/watch/providers response
 */
export type TmdbShowWatchProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
};

export type TmdbShowWatchRegion = {
  link: string;
  flatrate?: TmdbShowWatchProvider[];
  rent?: TmdbShowWatchProvider[];
  buy?: TmdbShowWatchProvider[];
};

export type TmdbShowWatchProviders = {
  id: number;
  results?: Record<string, TmdbShowWatchRegion>;
};

/**
 * /tv/{show_id}/season/{season_number} response
 */
const season = type({
  id: 'number',
  season_number: 'number',
  air_date: 'string | null',
  name: 'string',
  overview: 'string',
  poster_path: 'string | null',
  episodes: type({
    id: 'number',
    episode_number: 'number',
    season_number: 'number',
    air_date: 'string | null',
    name: 'string',
    overview: 'string',
    'runtime?': 'number | null',
    vote_average: 'number',
  }).array(),
});

export type TmdbSeason = typeof season.infer;

/**
 * Search result item (used in both search and trending)
 */
const showSummary = type({
  id: 'number',
  name: 'string',
  'backdrop_path?': 'string | null',
  'poster_path?': 'string | null',
  'first_air_date?': 'string',
  overview: 'string',
  vote_average: 'number',
  vote_count: 'number',
  popularity: 'number',
  'genre_ids?': 'number[]',
  origin_country: 'string[]',
  original_language: 'string',
  original_name: 'string',
});

export type TmdbShowSummary = typeof showSummary.infer;

/**
 * /search/tv response
 */
const searchResult = type({
  page: 'number',
  total_pages: 'number',
  total_results: 'number',
  results: showSummary.array(),
});

export type TmdbSearchResult = typeof searchResult.infer;

/**
 * /trending/tv/week and /tv/top_rated response
 */
const showList = type({
  page: 'number',
  results: showSummary.array(),
  total_pages: 'number',
  total_results: 'number',
});

export type TmdbShowList = typeof showList.infer;

/**
 * Combined schema object
 */
export const tmdbSchema = {
  show,
  showVideos,
  showReviews,
  season,
  searchResult,
  showList,
  showSummary,
};
