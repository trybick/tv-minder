import axios from 'axios';
import { AppThunk } from 'store';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';

export const FETCH_USER_FOLLOWS = 'FETCH_USER_FOLLOWS';
export const REMOVE_FROM_FOLLOWED_SHOWS = 'REMOVE_FROM_FOLLOWED_SHOWS';
export const SAVE_TO_FOLLOWED_SHOWS = 'SAVE_TO_FOLLOWED_SHOWS';
export const SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN = 'SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN';
export const SET_IS_LOGGED_IN_FALSE = 'SET_IS_LOGGED_IN_FALSE';
export const SET_IS_LOGGED_IN_TRUE = 'SET_IS_LOGGED_IN_TRUE';
export const UNREGISTERED_CLEAR_FOLLOWED_SHOWS = 'UNREGISTERED_CLEAR_FOLLOWED_SHOWS';
export const UNREGISTERED_REMOVE_FROM_FOLLOWED_SHOWS = 'UNREGISTERED_REMOVE_FROM_FOLLOWED_SHOWS';
export const UNREGISTERED_SAVE_TO_FOLLOWED_SHOWS = 'UNREGISTERED_SAVE_TO_FOLLOWED_SHOWS';

export const fetchfollowedShowsAction = (): AppThunk => (dispatch) =>
  axios
    .get(`${baseUrl}/follow`, {
      params: { token: localStorage.getItem('jwt') },
    })
    .then(({ data }) => {
      dispatch({
        type: FETCH_USER_FOLLOWS,
        payload: data,
      });
    })
    .catch(handleErrors);

export const setHasLocalWarningToastBeenShownAction = (): AppThunk => (dispatch) => {
  dispatch({
    type: SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN,
  });
};

export const setIsLoggedOutAction = (): AppThunk => (dispatch) => {
  dispatch({
    type: SET_IS_LOGGED_IN_FALSE,
  });
};

export const setIsLoggedInAction = (): AppThunk => (dispatch) => {
  dispatch({
    type: SET_IS_LOGGED_IN_TRUE,
  });
};

export const removeFromFollowedShowsAction = (showId: string): AppThunk => (dispatch) => {
  dispatch({
    type: REMOVE_FROM_FOLLOWED_SHOWS,
    payload: showId,
  });
};

export const saveToFollowedShowsAction = (showId: string): AppThunk => (dispatch) => {
  dispatch({
    type: SAVE_TO_FOLLOWED_SHOWS,
    payload: showId,
  });
};

export const unregisteredClearFollowedShowsAction = (): AppThunk => (dispatch) => {
  dispatch({
    type: UNREGISTERED_CLEAR_FOLLOWED_SHOWS,
  });
};

export const unregisteredSaveToFollowedShowsAction = (showId: string): AppThunk => (dispatch) => {
  dispatch({
    type: UNREGISTERED_SAVE_TO_FOLLOWED_SHOWS,
    payload: showId,
  });
};

export const unregisteredRemoveFromFollowedShowsAction = (showId: string): AppThunk => (
  dispatch
) => {
  dispatch({
    type: UNREGISTERED_REMOVE_FROM_FOLLOWED_SHOWS,
    payload: showId,
  });
};
