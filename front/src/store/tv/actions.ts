import axios from 'axios';
import moment from 'moment';
import { AppThunk } from 'store';
import { API_URLS } from 'utils/constants';
import { SavedQuery } from './types';
import handleErrors from 'utils/handleErrors';

export const SAVE_SEARCH_QUERY = 'SAVE_SEARCH_QUERY';
export const SAVE_EPISODE_DATA = 'SAVE_EPISODE_DATA';
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

// Get valid cached data and/or fetch data for a show's basic info
export const requestBasicShowInfoAction = (): AppThunk => async (dispatch, getState) => {
  const { followedShows } = getState().user;
  const { basicShowInfo: cachedBasicShowInfo } = getState().tv;
  const combinedData: { [key: number]: any } = {};

  // Get cached data and add to combinedData
  const CACHE_DURATION_DAYS = 5;
  const cachedIds = Object.keys(cachedBasicShowInfo);
  const validCachedIds = followedShows.filter(id => {
    const cacheAge = moment().diff(moment(cachedBasicShowInfo[id]?._fetchedAt), 'days');

    return cachedIds.includes(String(id)) && cacheAge < CACHE_DURATION_DAYS;
  });
  validCachedIds &&
    validCachedIds.forEach(id => {
      combinedData[id] = cachedBasicShowInfo[id];
    });

  // Fetch data for ids that are not cached and add to combinedData
  const nonCachedIds = followedShows.filter(id => !validCachedIds.includes(id));
  if (nonCachedIds) {
    const requests = nonCachedIds.map(id =>
      axios.get(`${API_URLS.MOVIE_DB}/tv/${id}`, {
        params: { api_key: process.env.REACT_APP_MOVIE_DB_KHEE },
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
