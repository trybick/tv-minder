import ky from 'ky';

import ENDPOINTS from '~/app/endpoints';
import { AppThunk } from '~/store';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';
import cacheDurationDays from '~/utils/cacheDurations';
import dayjs from '~/utils/dayjs';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';
import handleErrors from '~/utils/handleErrors';

import { SavedQuery } from './reducers';
import { getEpisodesForCalendar } from './services/getEpisodesForCalendar';

export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const SAVE_CALENDAR_EPISODES_CACHE = 'SAVE_CALENDAR_EPISODES_CACHE';
export const SET_CURRENT_CALENDAR_EPISODES = 'SET_CURRENT_CALENDAR_EPISODES';
export const SET_IS_LOADING_CALENDAR_EPISODES =
  'SET_IS_LOADING_CALENDAR_EPISODES';
export const SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS =
  'SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS';
export const SAVE_BASIC_SHOW_INFO_FOR_SHOW = 'SAVE_BASIC_SHOW_INFO_FOR_SHOW';
export const SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW =
  'SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW';
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

export const getBasicShowInfoForFollowedShows =
  (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const { basicShowInfo: cachedBasicShowInfo } = state.tv;
    const followedShowsSource = selectFollowedShows(state);
    const combinedData: { [key: number]: any } = {};

    // Get cached data and add to combinedData
    const cachedIds = cachedBasicShowInfo && Object.keys(cachedBasicShowInfo);
    const validCachedIds =
      cachedBasicShowInfo &&
      followedShowsSource?.filter(id => {
        const cacheAge = dayjs().diff(
          dayjs(cachedBasicShowInfo[id]?._fetchedAt),
          'day'
        );
        return (
          cachedIds?.includes(String(id)) &&
          cacheAge < cacheDurationDays.following
        );
      });

    if (validCachedIds?.length) {
      validCachedIds.forEach(id => {
        combinedData[id] = cachedBasicShowInfo[id];
      });
    }

    // Fetch data for ids that are not cached and add to combinedData
    const nonCachedIds = followedShowsSource?.filter(
      id => !validCachedIds?.includes(id)
    );
    if (nonCachedIds?.length) {
      const responses = await Promise.all(
        nonCachedIds.map(id =>
          ky
            .get(`${ENDPOINTS.THE_MOVIE_DB}/tv/${id}`, {
              searchParams: {
                api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY,
                append_to_response: 'videos',
              },
            })
            .json<any>()
        )
      ).catch(handleErrors);

      if (responses) {
        responses.forEach((res: any) => {
          combinedData[res.id] = {
            ...res,
            _fetchedAt: dayjs().toISOString(),
          };
        });
      }
    }

    dispatch({
      type: SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS,
      payload: combinedData,
    });
  };

export const getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow =
  (): AppThunk => async (dispatch, getState) => {
    const showId = getShowIdFromUrl();
    // If we already have the basic show info, season info, and cache is valid, do nothing
    const { basicShowInfo: cachedBasicShowInfo } = getState().tv;
    const cacheAge = dayjs().diff(
      dayjs(cachedBasicShowInfo[showId]?._fetchedAt),
      'day'
    );
    const hasValidCache =
      cachedBasicShowInfo[showId]?.hasOwnProperty('seasonsWithEpisodes') &&
      cacheAge < cacheDurationDays.following;
    if (hasValidCache) {
      dispatch({
        type: SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW,
        payload: false,
      });
      return;
    }

    // If we don't have a valid cache, start by fetching the basic info
    dispatch({ type: SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW, payload: true });
    const basicInfo = await ky
      .get(`${ENDPOINTS.THE_MOVIE_DB}/tv/${showId}`, {
        searchParams: {
          api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY,
          append_to_response: 'videos',
        },
      })
      .json<any>()
      .catch(handleErrors);

    if (!basicInfo) {
      return;
    }

    // Create an object to allow merging basic info with season info
    const combinedData = {
      [showId]: {
        ...basicInfo,
        _fetchedAt: dayjs().toISOString(),
      },
    };

    // Fetch full seasons and episodes data
    const seasonNumbers: number[] = basicInfo.seasons?.map(
      (season: any) => season.season_number
    );
    const seasonsResponse = await Promise.all(
      seasonNumbers.map(seasonNumber =>
        ky
          .get(
            `${ENDPOINTS.THE_MOVIE_DB}/tv/${showId}/season/${seasonNumber}`,
            {
              searchParams: { api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY },
            }
          )
          .json<any>()
      )
    ).catch(handleErrors);

    // Merge the season data
    seasonsResponse?.forEach((season: any) => {
      combinedData[showId] = {
        ...combinedData[showId],
        seasonsWithEpisodes: {
          ...combinedData[showId].seasonsWithEpisodes,
          [season.season_number]: season,
        },
      };
    });

    dispatch({
      type: SAVE_BASIC_SHOW_INFO_FOR_SHOW,
      payload: combinedData,
    });
  };

export const getPopularShowsAction = (): AppThunk => (dispatch, getState) => {
  const { popularShows: cachedPopularShows } = getState().tv;

  // Check if popular shows has a valid cache
  const cacheAge =
    cachedPopularShows?.length &&
    cachedPopularShows[0].fetchedAt &&
    dayjs().diff(dayjs(cachedPopularShows[0].fetchedAt), 'day');
  const isCacheValid =
    cachedPopularShows?.length && cacheDurationDays.popularShows > cacheAge;

  if (!isCacheValid) {
    // The Popular Shows feature used to use the '/tv/popular' endpoint but that was returning
    // a lot foreign shows. Using the '/trending' endpoint seems to have better results.
    // Full possibly useful endpoints status:
    //   - /trending = useful, current Popular Shows list
    //   - /top-rated = useful and accurate
    //   - /popular = not useful, foreign shows
    //   - /airing_today = not useful, foreign shows
    //   - /on_the_air = not useful, foreign shows
    ky.get(`${ENDPOINTS.THE_MOVIE_DB}/trending/tv/week`, {
      searchParams: { api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY },
    })
      .json<{ results: any[] }>()
      .then(({ results }) => {
        const dataWithTimestamp = results.map((show: any) => ({
          ...show,
          fetchedAt: dayjs().toISOString(),
        }));
        dispatch({
          type: SAVE_POPULAR_SHOWS,
          payload: dataWithTimestamp,
        });
      })
      .catch(handleErrors);
  }
};

export const getTopRatedShowsAction = (): AppThunk => (dispatch, getState) => {
  const { topRatedShows: cachedTopRatedShows } = getState().tv;
  const cacheAge =
    cachedTopRatedShows?.length &&
    cachedTopRatedShows[0].fetchedAt &&
    dayjs().diff(dayjs(cachedTopRatedShows[0].fetchedAt), 'day');
  const isCacheValid =
    cachedTopRatedShows?.length && cacheDurationDays.popularShows > cacheAge;

  if (!isCacheValid) {
    ky.get(`${ENDPOINTS.THE_MOVIE_DB}/tv/top_rated`, {
      searchParams: { api_key: import.meta.env.VITE_THE_MOVIE_DB_KEY },
    })
      .json<{ results: any[] }>()
      .then(({ results }) => {
        const dataWithTimestamp = results.map((show: any) => ({
          ...show,
          fetchedAt: dayjs().toISOString(),
        }));
        dispatch({
          type: SAVE_TOP_RATED_SHOWS,
          payload: dataWithTimestamp,
        });
      })
      .catch(handleErrors);
  }
};
