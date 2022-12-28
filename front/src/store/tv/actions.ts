import axios from 'axios';
import moment from 'moment';
import { AppThunk } from 'store';
import { getEpisodesForCalendar } from 'gateway/getEpisodes';
import { SavedQuery } from './types';
import { API } from 'constants/api';
import handleErrors from 'utils/handleErrors';
import cacheDurationDays from 'utils/cacheDurations';

export const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export const SAVE_CALENDAR_EPISODES_CACHE = 'SAVE_CALENDAR_EPISODES_CACHE';
export const SET_CURRENT_CALENDAR_EPISODES = 'SET_CURRENT_CALENDAR_EPISODES';
export const SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS = 'SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS';
export const SAVE_BASIC_SHOW_INFO_FOR_SHOW = 'SAVE_BASIC_SHOW_INFO_FOR_SHOW';
export const SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW = 'SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW';
export const SAVE_POPULAR_SHOWS = 'SAVE_POPULAR_SHOWS';
export const EXPAND_MY_SHOWS_TABLE_ROW = 'EXPAND_MY_SHOWS_TABLE_ROW';

export const saveSearchQueryAction =
  (query: SavedQuery): AppThunk =>
  dispatch => {
    dispatch({
      type: SET_SEARCH_QUERY,
      payload: query,
    });
  };

export const getEpisodesForCalendarAction = (): AppThunk => async (dispatch, getState) => {
  const { followedShows, isLoggedIn, unregisteredFollowedShows } = getState().user;
  const { episodeData: storedEpisodeData } = getState().tv;
  const userFollowedShowsIds = isLoggedIn ? followedShows : unregisteredFollowedShows;

  const cachedIds = Object.keys(storedEpisodeData);
  const validCachedIds = userFollowedShowsIds.filter(
    id =>
      cachedIds.includes(String(id)) &&
      cacheDurationDays.calendar > moment().diff(moment(storedEpisodeData[id].fetchedAt), 'days')
  );
  const cachedData = validCachedIds.flatMap(id =>
    storedEpisodeData[id].episodes !== null ? Object.values(storedEpisodeData[id].episodes) : []
  );
  let fetchedData;
  const nonCachedIds = userFollowedShowsIds.filter(id => !validCachedIds.includes(id));
  if (nonCachedIds?.length) {
    const { cache, fetchedEpisodeData } = await getEpisodesForCalendar(nonCachedIds);
    fetchedData = fetchedEpisodeData;
    dispatch({
      type: SAVE_CALENDAR_EPISODES_CACHE,
      payload: cache,
    });
  }

  const combinedEpisodesForDisplay = (cachedData || []).concat(fetchedData || []);
  dispatch({
    type: SET_CURRENT_CALENDAR_EPISODES,
    payload: combinedEpisodesForDisplay,
  });
};

export const getBasicShowInfoForFollowedShows = (): AppThunk => async (dispatch, getState) => {
  const { followedShows, isLoggedIn, unregisteredFollowedShows } = getState().user;
  const { basicShowInfo: cachedBasicShowInfo } = getState().tv;
  const followedShowsSource = isLoggedIn ? followedShows : unregisteredFollowedShows;
  const combinedData: { [key: number]: any } = {};

  // Get cached data and add to combinedData
  const cachedIds = cachedBasicShowInfo && Object.keys(cachedBasicShowInfo);
  const validCachedIds =
    cachedBasicShowInfo &&
    followedShowsSource?.filter(id => {
      const cacheAge = moment().diff(moment(cachedBasicShowInfo[id]?._fetchedAt), 'days');
      return cachedIds?.includes(String(id)) && cacheAge < cacheDurationDays.myShows;
    });
  validCachedIds &&
    validCachedIds.forEach(id => {
      combinedData[id] = cachedBasicShowInfo[id];
    });

  // Fetch data for ids that are not cached and add to combinedData
  const nonCachedIds = followedShowsSource?.filter(id => !validCachedIds?.includes(id));
  if (nonCachedIds) {
    const requests = nonCachedIds?.map(id =>
      axios.get(`${API.THE_MOVIE_DB}/tv/${id}`, {
        params: { api_key: process.env.REACT_APP_THE_MOVIE_DB_KEY, append_to_response: 'videos' },
      })
    );

    const responses = await axios
      .all(requests)
      .then(res => res.map(res => res.data))
      .catch(handleErrors);

    responses &&
      responses.forEach((res: any) => {
        combinedData[res.id] = {
          ...res,
          _fetchedAt: moment(),
        };
      });
  }

  dispatch({
    type: SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS,
    payload: combinedData,
  });
};

export const getBasicShowInfoAndSeasonsWithEpisodesForShow =
  (showId: number): AppThunk =>
  async (dispatch, getState) => {
    // If we already have the basic show info, season info, and cache is valid, do nothing
    const { basicShowInfo: cachedBasicShowInfo } = getState().tv;
    const cacheAge = moment().diff(moment(cachedBasicShowInfo[showId]?._fetchedAt), 'days');
    const hasValidCache =
      cachedBasicShowInfo[showId]?.hasOwnProperty('seasonsWithEpisodes') &&
      cacheAge < cacheDurationDays.myShows;
    if (hasValidCache) {
      dispatch({ type: SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW, payload: false });
      return;
    }

    // If we don't have a valid cache, start by fetching the basic info
    dispatch({ type: SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW, payload: true });
    const basicInfo = await axios
      .get(`${API.THE_MOVIE_DB}/tv/${showId}`, {
        params: { api_key: process.env.REACT_APP_THE_MOVIE_DB_KEY, append_to_response: 'videos' },
      })
      .then(res => res.data)
      .catch(handleErrors);

    // Create an object to allow merging basic info with season info
    const combinedData = {
      [showId]: {
        ...basicInfo,
        _fetchedAt: moment(),
      },
    };

    // Fetch full seasons and episodes data
    const seasonNumbers: number[] = basicInfo.seasons?.map((season: any) => season.season_number);
    const seasonsRequests = seasonNumbers?.map(seasonNumber =>
      axios.get(`${API.THE_MOVIE_DB}/tv/${showId}/season/${seasonNumber}`, {
        params: { api_key: process.env.REACT_APP_THE_MOVIE_DB_KEY },
      })
    );
    const seasonsResponse = await axios
      .all(seasonsRequests)
      .then(res => res.map((res: any) => res.data))
      .catch(handleErrors);

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
    moment().diff(moment(cachedPopularShows[0].fetchedAt), 'days');
  const isCacheValid = cachedPopularShows?.length && cacheDurationDays.popularShows > cacheAge;

  if (!isCacheValid) {
    axios
      // The Popular Shows feature used to use the '/tv/popular' endpoint but that was returning
      // a lot foreign shows. Using the '/trending' endpoint seems to have better results.
      .get(`${API.THE_MOVIE_DB}/trending/tv/week`, {
        params: { api_key: process.env.REACT_APP_THE_MOVIE_DB_KEY },
      })
      .then(({ data: { results } }) => {
        const dataWithTimestamp = results.map((show: any) => ({ ...show, fetchedAt: moment() }));
        dispatch({
          type: SAVE_POPULAR_SHOWS,
          payload: dataWithTimestamp,
        });
      })
      .catch(handleErrors);
  }
};

export const expandMyShowsTableRowAction =
  (showId: number | null): AppThunk =>
  dispatch => {
    dispatch({
      type: EXPAND_MY_SHOWS_TABLE_ROW,
      payload: showId,
    });
  };
