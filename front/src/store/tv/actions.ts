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

// Check if shows in store are validly cached. If not, fetch basic show info for each show.
export const requestBasicShowInfoAction = (): AppThunk => async (dispatch, getState) => {
  const { followedShows } = getState().user;
  const { basicShowInfo: cachedBasicShowInfo } = getState().tv;

  const CACHE_DURATION_DAYS = 5;
  const cachedIds = Object.keys(cachedBasicShowInfo);
  const nonCachedIds = followedShows.filter(
    id =>
      !cachedIds.includes(String(id)) ||
      (cachedIds.includes(String(id)) &&
        CACHE_DURATION_DAYS < moment().diff(moment(cachedBasicShowInfo[id]._fetchedAt), 'days'))
  );

  const requests = nonCachedIds.map((showId: any) =>
    axios.get(`${API_URLS.MOVIE_DB}/tv/${showId}`, {
      params: { api_key: process.env.REACT_APP_MOVIE_DB_KHEE },
    })
  );

  const responses = await axios
    .all(requests)
    .then(res => res.map(res => res.data))
    .catch(handleErrors);

  if (responses) {
    const basicShowInfo: { [key: number]: any } = {};

    responses.forEach((res: any) => {
      basicShowInfo[res.id] = {
        ...res,
        _fetchedAt: moment(),
      };
    });

    dispatch({
      type: REQUEST_BASIC_SHOW_INFO_SUCCEEDED,
      payload: basicShowInfo,
    });
  }
};
