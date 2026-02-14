import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';
import { handleKyError } from '~/utils/handleKyError';

import { type AppThunk } from './..';
import { getEpisodesForCalendar } from './services/getEpisodesForCalendar';
import {
  type TmdbSeason,
  type TmdbShow,
  type TmdbShowList,
  type TmdbShowReviews,
  type TmdbShowSummary,
  type TmdbShowVideos,
  type TmdbShowWatchProviders,
} from './types/tmdbSchema';
import { type TmdbShowWithSeasons } from './types/transformed';
import { tmdbApi } from './utils/tmdbApi';

export const SET_CURRENT_CALENDAR_EPISODES = 'SET_CURRENT_CALENDAR_EPISODES';
export const SET_IS_LOADING_CALENDAR_EPISODES =
  'SET_IS_LOADING_CALENDAR_EPISODES';
export const SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS =
  'SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS';
export const SAVE_SHOW_DETAILS_FOR_SHOW = 'SAVE_SHOW_DETAILS_FOR_SHOW';
export const SET_IS_LOADING_SHOW_DETAILS = 'SET_IS_LOADING_SHOW_DETAILS';
export const SAVE_SEARCH_SHOW_DETAILS = 'SAVE_SEARCH_SHOW_DETAILS';
export const SAVE_DISCOVER_SHOWS = 'SAVE_DISCOVER_SHOWS';
export const SAVE_RECOMMENDATIONS = 'SAVE_RECOMMENDATIONS';
export const SAVE_FOR_YOU_SHOWS = 'SAVE_FOR_YOU_SHOWS';

const DEFAULT_WATCH_REGION = 'US';
const SHOW_APPEND_TO_RESPONSE = 'videos,reviews,watch/providers';

export const getEpisodesForCalendarAction =
  (): AppThunk => async (dispatch, getState) => {
    const state = getState();

    dispatch({ type: SET_IS_LOADING_CALENDAR_EPISODES, payload: true });

    const userFollowedShowsIds = selectFollowedShows(state);
    const { fetchedEpisodeData } =
      await getEpisodesForCalendar(userFollowedShowsIds);

    dispatch({
      type: SET_CURRENT_CALENDAR_EPISODES,
      payload: fetchedEpisodeData,
    });
  };

export const getShowDetailsForFollowedShows =
  (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const followedShowsSource = selectFollowedShows(state);
    if (!followedShowsSource?.length) {
      return;
    }

    const { showDetails } = state.tv;
    const idsToFetch = followedShowsSource.filter(id => !showDetails[id]);
    if (!idsToFetch.length) {
      return;
    }

    const results = await Promise.allSettled(
      idsToFetch.map(id => tmdbApi.getShow(id))
    );

    const data: Record<number, TmdbShowWithSeasons> = {};
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        data[result.value.id] = result.value;
      }
    });

    if (!Object.keys(data).length) {
      return;
    }

    dispatch({
      type: SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS,
      payload: data,
    });
  };

/*
 * Fetch the full show details for search results to get the last episode data
 * so we can show the 'Airing Now' badge in the search results.
 */
export const getShowDetailsForSearchResults =
  (showIds: number[]): AppThunk =>
  async (dispatch, getState) => {
    if (!showIds?.length) {
      return;
    }

    const { showDetails, searchShowDetails } = getState().tv;
    const idsToFetch = showIds.filter(
      id => !showDetails[id] && !searchShowDetails[id]
    );
    if (!idsToFetch.length) {
      return;
    }

    const results = await Promise.allSettled(
      idsToFetch.map(showId => tmdbApi.getShow(showId))
    );
    const data: Record<number, TmdbShowWithSeasons> = {};

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        data[result.value.id] = result.value;
      } else {
        handleKyError(result.reason);
      }
    });

    if (Object.keys(data).length) {
      dispatch({ type: SAVE_SEARCH_SHOW_DETAILS, payload: data });
    }
  };

const getWatchRegion = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_WATCH_REGION;
  }

  const region = window.navigator.language?.split('-')[1]?.toUpperCase();
  if (region && region.length === 2) {
    return region;
  }

  return DEFAULT_WATCH_REGION;
};

type ShowWithAppendedData = TmdbShow & {
  reviews?: TmdbShowReviews;
  'watch/providers'?: TmdbShowWatchProviders;
};

const getAppendedShowData = (showData: TmdbShow) => {
  const appendedData = showData as ShowWithAppendedData;
  return {
    showVideos: appendedData.videos as TmdbShowVideos | undefined,
    showReviews: appendedData.reviews,
    showWatchProviders: appendedData['watch/providers'],
  };
};

export const getShowDetailsWithSeasons =
  (showId: number): AppThunk =>
  async (dispatch, getState) => {
    const existing = getState().tv.showDetails[showId];
    const hasRichContentData = !!(
      existing?.showVideos ||
      existing?.showReviews ||
      existing?.showWatchProviders
    );

    if (existing?.seasonsWithEpisodes && hasRichContentData) {
      dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: false });
      return;
    }

    dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: true });

    const watchRegion = getWatchRegion();
    let showData: TmdbShow;
    try {
      showData = await tmdbApi.getShow(showId, {
        appendToResponse: SHOW_APPEND_TO_RESPONSE,
        watchRegion,
      });
    } catch (error) {
      handleKyError(error);
      dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: false });
      return;
    }

    const {
      showVideos: appendedShowVideos,
      showReviews: appendedShowReviews,
      showWatchProviders: appendedShowWatchProviders,
    } = getAppendedShowData(showData);
    const showVideos: TmdbShowVideos | undefined = appendedShowVideos;
    const showReviews: TmdbShowReviews | undefined = appendedShowReviews;
    const showWatchProviders: TmdbShowWatchProviders | undefined =
      appendedShowWatchProviders;

    const seasonNumbers: number[] =
      showData.seasons?.map(season => season.season_number) ?? [];

    const seasonResults = await Promise.allSettled(
      seasonNumbers.map(seasonNumber => tmdbApi.getSeason(showId, seasonNumber))
    );

    const seasonsWithEpisodes: Record<number, TmdbSeason> = {};
    seasonResults.forEach(result => {
      if (result.status === 'fulfilled') {
        const season = result.value;
        seasonsWithEpisodes[season.season_number] = season;
      }
    });

    dispatch({
      type: SAVE_SHOW_DETAILS_FOR_SHOW,
      payload: {
        [showId]: {
          ...showData,
          seasonsWithEpisodes,
          showVideos,
          showReviews,
          showWatchProviders,
          watchRegion,
        },
      },
    });
  };

export const getRecommendationsForSingleShow =
  (showId: number): AppThunk =>
  async (dispatch, getState) => {
    const { recommendations } = getState().tv;
    if (recommendations[showId]) {
      return;
    }

    try {
      const data = await tmdbApi.getRecommendations(showId);
      dispatch({
        type: SAVE_RECOMMENDATIONS,
        payload: { showId, results: data.results },
      });
    } catch (error) {
      handleKyError(error);
      dispatch({
        type: SAVE_RECOMMENDATIONS,
        payload: { showId, results: [] },
      });
    }
  };

const FIVE_HOURS_MS = 5 * 60 * 60 * 1000;

function pickStableIndices(arrayLength: number, count: number): number[] {
  const epoch = Math.floor(Date.now() / FIVE_HOURS_MS);
  const indices: number[] = [];
  for (let i = 0; i < count && i < arrayLength; i++) {
    let index = (epoch + i * 7) % arrayLength;
    while (indices.includes(index)) {
      index = (index + 1) % arrayLength;
    }
    indices.push(index);
  }
  return indices;
}

export const fetchForYouShowsAction =
  (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    if (state.tv.forYouShows.length) {
      return;
    }

    const followedShows = selectFollowedShows(state);
    if (followedShows.length < 2) {
      return;
    }

    const sorted = [...followedShows].sort((a, b) => a - b);
    const indices = pickStableIndices(sorted.length, 2);
    const selectedIds = indices.map(i => sorted[i]);

    const results = await Promise.allSettled(
      selectedIds.map(id => tmdbApi.getRecommendations(id))
    );

    const followedSet = new Set(followedShows);
    const lists: TmdbShowSummary[][] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const filtered = result.value.results.filter(
          show => !followedSet.has(show.id)
        );
        lists.push(filtered);
      } else {
        handleKyError(result.reason);
      }
    }

    if (lists.length === 0) {
      dispatch({ type: SAVE_FOR_YOU_SHOWS, payload: [] });
      return;
    }

    const interleaved: TmdbShowSummary[] = [];
    const seenRecommendedIds = new Set<number>();
    const maxLength = Math.max(...lists.map(list => list.length));

    for (let i = 0; i < maxLength; i++) {
      for (const list of lists) {
        if (i < list.length) {
          const show = list[i];
          if (!seenRecommendedIds.has(show.id)) {
            interleaved.push(show);
            seenRecommendedIds.add(show.id);
          }
        }
      }
    }

    dispatch({ type: SAVE_FOR_YOU_SHOWS, payload: interleaved });
  };

// ─────────────────────────────────────────────────────────────
// DISCOVER SHOWS - Consolidated carousel fetching
// ─────────────────────────────────────────────────────────────

const NETWORK_IDS = {
  NETFLIX: 213,
  HBO: 49,
  DISNEY_PLUS: 2739,
  APPLE_TV: 2552,
} as const;

const GENRE_IDS = {
  ACTION: 10759,
  DRAMA: 18,
  DOCUMENTARY: 99,
  SCIFI: 10765,
} as const;

export const DISCOVER_CAROUSEL_KEYS = [
  'trending',
  'airingThisWeek',
  'newShows',
  'comingSoon',
  'returningThisMonth',
  'mostRated',
  'highestRated',
  'action',
  'drama',
  'sciFi',
  'documentary',
  'netflix',
  'hbo',
  'disney',
  'appleTv',
] as const;

export type DiscoverCarouselKey = (typeof DISCOVER_CAROUSEL_KEYS)[number];

export type DiscoverShowsState = Record<DiscoverCarouselKey, TmdbShowSummary[]>;

const CAROUSEL_FETCHERS: Record<
  DiscoverCarouselKey,
  () => Promise<TmdbShowList>
> = {
  trending: tmdbApi.getTrending,
  airingThisWeek: tmdbApi.discoverAiringThisWeek,
  newShows: tmdbApi.discoverNewShows,
  comingSoon: tmdbApi.discoverComingSoon,
  returningThisMonth: tmdbApi.discoverReturningThisMonth,
  mostRated: tmdbApi.discoverMostRated,
  highestRated: tmdbApi.discoverHighestRated,
  action: () => tmdbApi.discoverByGenre(GENRE_IDS.ACTION),
  drama: () => tmdbApi.discoverByGenre(GENRE_IDS.DRAMA),
  sciFi: () => tmdbApi.discoverByGenre(GENRE_IDS.SCIFI),
  documentary: () => tmdbApi.discoverByGenre(GENRE_IDS.DOCUMENTARY),
  netflix: () => tmdbApi.discoverByNetwork(NETWORK_IDS.NETFLIX),
  hbo: () => tmdbApi.discoverByNetwork(NETWORK_IDS.HBO),
  disney: () => tmdbApi.discoverByNetwork(NETWORK_IDS.DISNEY_PLUS),
  appleTv: () => tmdbApi.discoverByNetwork(NETWORK_IDS.APPLE_TV),
};

export const fetchDiscoverShowsAction =
  (): AppThunk => async (dispatch, getState) => {
    const { discoverShows } = getState().tv;
    const keysToFetch = DISCOVER_CAROUSEL_KEYS.filter(
      key => !discoverShows[key]?.length
    );
    if (!keysToFetch.length) {
      return;
    }

    const fetchCarousel = async (key: DiscoverCarouselKey) => {
      try {
        const data = await CAROUSEL_FETCHERS[key]();
        return { key, shows: data.results };
      } catch (error) {
        handleKyError(error);
        return null;
      }
    };

    const [priorityKeys, remainingKeys] = [
      keysToFetch.slice(0, 1),
      keysToFetch.slice(1),
    ];

    const priorityResults = await Promise.all(priorityKeys.map(fetchCarousel));
    const priorityData: Partial<DiscoverShowsState> = {};
    priorityResults.forEach(result => {
      if (result) {
        priorityData[result.key] = result.shows;
      }
    });
    if (Object.keys(priorityData).length) {
      dispatch({ type: SAVE_DISCOVER_SHOWS, payload: priorityData });
    }

    if (remainingKeys.length) {
      const remainingResults = await Promise.all(
        remainingKeys.map(fetchCarousel)
      );
      const remainingData: Partial<DiscoverShowsState> = {};
      remainingResults.forEach(result => {
        if (result) {
          remainingData[result.key] = result.shows;
        }
      });
      if (Object.keys(remainingData).length) {
        dispatch({ type: SAVE_DISCOVER_SHOWS, payload: remainingData });
      }
    }
  };
