import axios from 'axios';
import { AppThunk } from 'store';
import { ID } from 'types/common';
import { API } from 'utils/constants';
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

export const fetchfollowedShowsAction = (): AppThunk => dispatch =>
  axios
    .get<{
      followedShows: ID[];
    }>(`${API.TV_MINDER}/follow`, {
      params: { token: localStorage.getItem('jwt') },
    })
    .then(({ data }) => {
      dispatch({
        type: FETCH_USER_FOLLOWS,
        payload: data,
      });
    })
    .catch(handleErrors);

export const setHasLocalWarningToastBeenShownAction = (): AppThunk => dispatch => {
  dispatch({
    type: SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN,
  });
};

export const setIsLoggedOutAction = (): AppThunk => dispatch => {
  dispatch({
    type: SET_IS_LOGGED_IN_FALSE,
  });
};

export const setIsLoggedInAction = (): AppThunk => dispatch => {
  dispatch({
    type: SET_IS_LOGGED_IN_TRUE,
  });
};

// If logged in, add show to state and update API. Else just add to state
export const saveToFollowedShowsAction = (showId: number): AppThunk => (dispatch, getState) => {
  const { isLoggedIn } = getState().user;

  if (isLoggedIn) {
    dispatch({
      type: SAVE_TO_FOLLOWED_SHOWS,
      payload: showId,
    });

    axios
      .post(
        `${API.TV_MINDER}/follow`,
        {
          showId,
          token: localStorage.getItem('jwt'),
        },
        { timeout: 8000 }
      )
      .catch(handleErrors);
  } else {
    dispatch({
      type: UNREGISTERED_SAVE_TO_FOLLOWED_SHOWS,
      payload: showId,
    });
  }
};

// If logged in, remove show from state and update API. Else just remove from state
export const removeFromFollowedShowsAction = (showId: number): AppThunk => (dispatch, getState) => {
  const { isLoggedIn } = getState().user;

  if (isLoggedIn) {
    axios
      .delete(`${API.TV_MINDER}/follow`, {
        data: {
          showId,
          token: localStorage.getItem('jwt'),
        },
        timeout: 8000,
      })
      .catch(handleErrors);

    dispatch({
      type: REMOVE_FROM_FOLLOWED_SHOWS,
      payload: showId,
    });
  } else {
    dispatch({
      type: UNREGISTERED_REMOVE_FROM_FOLLOWED_SHOWS,
      payload: showId,
    });
  }
};

export const unregisteredClearFollowedShowsAction = (): AppThunk => dispatch => {
  dispatch({
    type: UNREGISTERED_CLEAR_FOLLOWED_SHOWS,
  });
};
