import axios from 'axios';
import moment from 'moment';
import { AppThunk } from 'store';
import { fetchEpisodeData } from 'gateway/getEpisodes';
import { SavedQuery } from './types';
import { API } from 'utils/constants';
import handleErrors from 'utils/handleErrors';
import cacheDurationDays from 'utils/cacheDurations';

export const SAVE_SEARCH_QUERY = 'SAVE_SEARCH_QUERY';
export const SAVE_EPISODE_DATA = 'SAVE_EPISODE_DATA';
export const SET_CALENDAR_EPISODES = 'SAVE_CALENDAR_EPISODES';
export const REQUEST_BASIC_SHOW_INFO = 'REQUEST_BASIC_SHOW_INFO';
export const REQUEST_BASIC_SHOW_INFO_SUCCEEDED = 'REQUEST_BASIC_SHOW_INFO_SUCCEEDED';

export const saveSearchQueryAction = (query: SavedQuery): AppThunk => dispatch => {
  dispatch({
    type: SAVE_SEARCH_QUERY,
    payload: query,
  });
};

export const saveEpisodeDataAction = (episodeData: any): AppThunk => dispatch => {
  dispatch({
    type: SAVE_EPISODE_DATA,
    payload: episodeData,
  });
};

export const setCalendarEpisodesAction = (episodesForDisplay: any): AppThunk => dispatch => {
  dispatch({
    type: SET_CALENDAR_EPISODES,
    payload: episodesForDisplay,
  });
};

export const loadEpisodesForCalendar = (): AppThunk => async (dispatch, getState) => {
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
  if (nonCachedIds.length) {
    const { cache, fetchedEpisodeData } = await fetchEpisodeData(nonCachedIds);
    fetchedData = fetchedEpisodeData;
    dispatch({
      type: SAVE_EPISODE_DATA,
      payload: cache,
    });
  }

  const combinedEpisodesForDisplay = (cachedData || []).concat(fetchedData || []);
  dispatch({
    type: SET_CALENDAR_EPISODES,
    payload: combinedEpisodesForDisplay,
  });
};

// Basic Show Info is used for latest episodes on My Shows page
export const requestBasicShowInfoAction = (): AppThunk => async (dispatch, getState) => {
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
        params: { api_key: process.env.REACT_APP_THE_MOVIE_DB_KEY },
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
    type: REQUEST_BASIC_SHOW_INFO_SUCCEEDED,
    payload: combinedData,
  });
};
