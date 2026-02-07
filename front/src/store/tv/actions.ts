import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';
import { handleKyError } from '~/utils/handleKyError';

import { type AppThunk } from './..';
import { getEpisodesForCalendar } from './services/getEpisodesForCalendar';
import {
  type TmdbSeason,
  type TmdbShow,
  type TmdbShowList,
  type TmdbShowSummary,
} from './types/tmdbSchema';
import {
  type SavedQuery,
  type TmdbShowWithSeasons,
} from './types/transformed';
import { tmdbApi } from './utils/tmdbApi';

export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const SAVE_CALENDAR_EPISODES_CACHE = 'SAVE_CALENDAR_EPISODES_CACHE';
export const SET_CURRENT_CALENDAR_EPISODES = 'SET_CURRENT_CALENDAR_EPISODES';
export const SET_IS_LOADING_CALENDAR_EPISODES =
  'SET_IS_LOADING_CALENDAR_EPISODES';
export const SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS =
  'SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS';
export const SAVE_SHOW_DETAILS_FOR_SHOW = 'SAVE_SHOW_DETAILS_FOR_SHOW';
export const SET_IS_LOADING_SHOW_DETAILS = 'SET_IS_LOADING_SHOW_DETAILS';
export const SAVE_SEARCH_SHOW_DETAILS = 'SAVE_SEARCH_SHOW_DETAILS';
export const SAVE_DISCOVER_SHOWS = 'SAVE_DISCOVER_SHOWS';

export const saveSearchQueryAction =
  (query: SavedQuery): AppThunk =>
  dispatch => {
    dispatch({
      type: SET_SEARCH_QUERY,
      payload: query,
    });
  };

export const getEpisodesForCalendarAction =
  (): AppThunk => async (dispatch, getState) => {
    dispatch({
      type: SET_IS_LOADING_CALENDAR_EPISODES,
      payload: true,
    });

    const state = getState();
    const { episodeData: storedEpisodeData } = state.tv;
    const userFollowedShowsIds = selectFollowedShows(state);

    const cachedIds = userFollowedShowsIds.filter(
      id => id in storedEpisodeData
    );
    const cachedData = cachedIds.flatMap(id =>
      storedEpisodeData[id].episodes !== null
        ? Object.values(storedEpisodeData[id].episodes)
        : []
    );
    const nonCachedIds = userFollowedShowsIds.filter(
      id => !(id in storedEpisodeData)
    );
    let fetchedData;
    if (nonCachedIds?.length) {
      const { cache, fetchedEpisodeData } =
        await getEpisodesForCalendar(nonCachedIds);
      fetchedData = fetchedEpisodeData;
      dispatch({
        type: SAVE_CALENDAR_EPISODES_CACHE,
        payload: cache,
      });
    }

    const combinedEpisodesForDisplay = (cachedData || []).concat(
      fetchedData || []
    );
    dispatch({
      type: SET_CURRENT_CALENDAR_EPISODES,
      payload: combinedEpisodesForDisplay,
    });
  };

export const getShowDetailsForFollowedShows =
  (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const { showDetails: cachedShowDetails } = state.tv;
    const followedShowsSource = selectFollowedShows(state);

    if (!followedShowsSource?.length) {
      return;
    }

    const combinedData: Record<number, TmdbShowWithSeasons> = {};

    const cachedIds = followedShowsSource.filter(
      id => cachedShowDetails[id] !== undefined
    );
    cachedIds.forEach(id => {
      combinedData[id] = cachedShowDetails[id];
    });

    const nonCachedIds = followedShowsSource.filter(
      id => cachedShowDetails[id] === undefined
    );
    if (nonCachedIds?.length) {
      const results = await Promise.allSettled(
        nonCachedIds.map(id => tmdbApi.getShow(id))
      );

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          combinedData[result.value.id] = result.value;
        }
      });
    }

    dispatch({
      type: SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS,
      payload: combinedData,
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
    const {
      showDetails: cachedShowDetails,
      searchShowDetails: cachedSearchShowDetails,
    } = getState().tv;
    const idsToFetch = showIds.filter(
      showId =>
        cachedShowDetails[showId] === undefined &&
        cachedSearchShowDetails[showId] === undefined
    );

    if (!idsToFetch.length) {
      return;
    }

    const results = await Promise.allSettled(
      idsToFetch.map(showId => tmdbApi.getShow(showId))
    );
    const combinedData: Record<number, TmdbShowWithSeasons> = {};

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        combinedData[result.value.id] = result.value;
      } else {
        handleKyError(result.reason);
      }
    });

    if (Object.keys(combinedData).length) {
      dispatch({
        type: SAVE_SEARCH_SHOW_DETAILS,
        payload: combinedData,
      });
    }
  };

export const getShowDetailsWithSeasons =
  (): AppThunk => async (dispatch, getState) => {
    const showId = getShowIdFromUrl();
    const { showDetails: cachedShowDetails } = getState().tv;

    if (cachedShowDetails[showId]?.seasonsWithEpisodes) {
      dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: false });
      return;
    }

    dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: true });

    let showData: TmdbShow;
    try {
      showData = await tmdbApi.getShow(showId);
    } catch (error) {
      handleKyError(error);
      dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: false });
      return;
    }

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

    const combinedData: Record<number, TmdbShowWithSeasons> = {
      [showId]: { ...showData, seasonsWithEpisodes },
    };

    dispatch({
      type: SAVE_SHOW_DETAILS_FOR_SHOW,
      payload: combinedData,
    });
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

export type DiscoverShowsState = Record<
  DiscoverCarouselKey,
  TmdbShowSummary[]
>;

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

    const [priorityKeys, remainingKeys] = [
      keysToFetch.slice(0, 1),
      keysToFetch.slice(1),
    ];

    const fetchCarousel = async (key: DiscoverCarouselKey) => {
      try {
        const data = await CAROUSEL_FETCHERS[key]();
        return { key, shows: data.results };
      } catch (error) {
        handleKyError(error);
        return null;
      }
    };

    if (priorityKeys.length) {
      const priorityResults = await Promise.all(
        priorityKeys.map(fetchCarousel)
      );
      const priorityData: Partial<DiscoverShowsState> = {};
      priorityResults.forEach(result => {
        if (result) {
          priorityData[result.key] = result.shows;
        }
      });
      if (Object.keys(priorityData).length) {
        dispatch({ type: SAVE_DISCOVER_SHOWS, payload: priorityData });
      }
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
