import { AppThunk } from '~/store';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';
import cacheDurationDays from '~/utils/cacheDurations';
import dayjs from '~/utils/dayjs';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

import { SavedQuery } from './reducers';
import { getEpisodesForCalendar } from './services/getEpisodesForCalendar';
import { TmdbSeason, TmdbShow, TmdbShowSummary } from './types/tmdbSchema';
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
export const SAVE_POPULAR_SHOWS = 'SAVE_POPULAR_SHOWS';
export const SAVE_TOP_RATED_SHOWS = 'SAVE_TOP_RATED_SHOWS';

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

    const cachedIds = Object.keys(storedEpisodeData);
    const validCachedIds = userFollowedShowsIds.filter(
      id =>
        cachedIds.includes(String(id)) &&
        cacheDurationDays.calendar >
          dayjs().diff(dayjs(storedEpisodeData[id].fetchedAt), 'day')
    );
    const cachedData = validCachedIds.flatMap(id =>
      storedEpisodeData[id].episodes !== null
        ? Object.values(storedEpisodeData[id].episodes)
        : []
    );
    let fetchedData;
    const nonCachedIds = userFollowedShowsIds.filter(
      id => !validCachedIds.includes(id)
    );
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

export type ShowDetailsCached = TmdbShow & {
  _fetchedAt: string;
  seasonsWithEpisodes?: Record<number, TmdbSeason>;
};

export const getShowDetailsForFollowedShows =
  (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const { showDetails: cachedShowDetails } = state.tv;
    const followedShowsSource = selectFollowedShows(state);

    // Prevent wiping cached data if no followed shows
    if (!followedShowsSource?.length) {
      return;
    }

    const combinedData: Record<number, ShowDetailsCached> = {};

    // Get cached data and add to combinedData
    const cachedIds = cachedShowDetails && Object.keys(cachedShowDetails);
    const validCachedIds =
      cachedShowDetails &&
      followedShowsSource?.filter(id => {
        const cacheAge = dayjs().diff(
          dayjs(cachedShowDetails[id]?._fetchedAt),
          'day'
        );
        return (
          cachedIds?.includes(String(id)) &&
          cacheAge < cacheDurationDays.following
        );
      });

    if (validCachedIds?.length) {
      validCachedIds.forEach(id => {
        combinedData[id] = cachedShowDetails[id];
      });
    }

    // Fetch data for ids that are not cached and add to combinedData
    const nonCachedIds = followedShowsSource?.filter(
      id => !validCachedIds?.includes(id)
    );
    if (nonCachedIds?.length) {
      const results = await Promise.allSettled(
        nonCachedIds.map(id => tmdbApi.getShow(id))
      );

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const res = result.value;
          combinedData[res.id] = {
            ...res,
            _fetchedAt: dayjs().toISOString(),
          };
        }
      });
    }

    dispatch({
      type: SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS,
      payload: combinedData,
    });
  };

export const getShowDetailsWithSeasons =
  (): AppThunk => async (dispatch, getState) => {
    const showId = getShowIdFromUrl();
    // If we already have show details with seasons and cache is valid, do nothing
    const { showDetails: cachedShowDetails } = getState().tv;
    const cacheAge = dayjs().diff(
      dayjs(cachedShowDetails[showId]?._fetchedAt),
      'day'
    );
    const hasValidCache =
      cachedShowDetails[showId]?.seasonsWithEpisodes &&
      cacheAge < cacheDurationDays.following;
    if (hasValidCache) {
      dispatch({
        type: SET_IS_LOADING_SHOW_DETAILS,
        payload: false,
      });
      return;
    }

    // If we don't have a valid cache, fetch the show details
    dispatch({ type: SET_IS_LOADING_SHOW_DETAILS, payload: true });

    let showData: TmdbShow;
    try {
      showData = await tmdbApi.getShow(showId);
    } catch (error) {
      console.error('Failed to fetch show info:', error);
      dispatch({
        type: SET_IS_LOADING_SHOW_DETAILS,
        payload: false,
      });
      return;
    }

    // Create an object to allow merging show data with season data
    const combinedData: Record<number, ShowDetailsCached> = {
      [showId]: {
        ...showData,
        _fetchedAt: dayjs().toISOString(),
      },
    };

    // Fetch full seasons and episodes data
    const seasonNumbers: number[] =
      showData.seasons?.map(season => season.season_number) ?? [];

    const seasonResults = await Promise.allSettled(
      seasonNumbers.map(seasonNumber => tmdbApi.getSeason(showId, seasonNumber))
    );

    // Merge the season data
    const seasonsWithEpisodes: Record<number, TmdbSeason> = {};
    seasonResults.forEach(result => {
      if (result.status === 'fulfilled') {
        const season = result.value;
        seasonsWithEpisodes[season.season_number] = season;
      }
    });

    combinedData[showId] = {
      ...combinedData[showId],
      seasonsWithEpisodes,
    };

    dispatch({
      type: SAVE_SHOW_DETAILS_FOR_SHOW,
      payload: combinedData,
    });
  };

export type PopularShowCached = TmdbShowSummary & {
  fetchedAt: string;
};

export const getPopularShowsAction =
  (): AppThunk => async (dispatch, getState) => {
    const { popularShows: cachedPopularShows } = getState().tv;

    // Check if popular shows has a valid cache
    const firstShow = cachedPopularShows?.[0];
    const cacheAge = firstShow?.fetchedAt
      ? dayjs().diff(dayjs(firstShow.fetchedAt), 'day')
      : Infinity;
    const isCacheValid =
      cachedPopularShows?.length && cacheDurationDays.popularShows > cacheAge;

    if (!isCacheValid) {
      try {
        // The Popular Shows feature used to use the '/tv/popular' endpoint but that was returning
        // a lot foreign shows. Using the '/trending' endpoint seems to have better results.
        // Full possibly useful endpoints status:
        //   - /trending = useful, current Popular Shows list
        //   - /top-rated = useful and accurate
        //   - /popular = not useful, foreign shows
        //   - /airing_today = not useful, foreign shows
        //   - /on_the_air = not useful, foreign shows
        const data = await tmdbApi.getTrending();
        const dataWithTimestamp: PopularShowCached[] = data.results.map(
          show => ({
            ...show,
            fetchedAt: dayjs().toISOString(),
          })
        );
        dispatch({
          type: SAVE_POPULAR_SHOWS,
          payload: dataWithTimestamp,
        });
      } catch (error) {
        console.error('Failed to fetch popular shows:', error);
      }
    }
  };

export const getTopRatedShowsAction =
  (): AppThunk => async (dispatch, getState) => {
    const { topRatedShows: cachedTopRatedShows } = getState().tv;
    const firstShow = cachedTopRatedShows?.[0];
    const cacheAge = firstShow?.fetchedAt
      ? dayjs().diff(dayjs(firstShow.fetchedAt), 'day')
      : Infinity;
    const isCacheValid =
      cachedTopRatedShows?.length && cacheDurationDays.popularShows > cacheAge;

    if (!isCacheValid) {
      try {
        const data = await tmdbApi.getTopRated();
        const dataWithTimestamp: PopularShowCached[] = data.results.map(
          show => ({
            ...show,
            fetchedAt: dayjs().toISOString(),
          })
        );
        dispatch({
          type: SAVE_TOP_RATED_SHOWS,
          payload: dataWithTimestamp,
        });
      } catch (error) {
        console.error('Failed to fetch top rated shows:', error);
      }
    }
  };
