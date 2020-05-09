import axios from 'axios';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';

export const SET_IS_LOGGED_IN_TRUE = 'SET_IS_LOGGED_IN_TRUE';
export const SET_IS_LOGGED_IN_FALSE = 'SET_IS_LOGGED_IN_FALSE';
export const SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN = 'SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN';
export const FETCH_USER_FOLLOWS = 'FETCH_USER_FOLLOWS';
export const FOLLOW_SHOW_FOR_UNREGISTERED_USER = 'FOLLOW_SHOW_FOR_UNREGISTERED_USER';
export const UNFOLLOW_SHOW_FOR_UNREGISTERED_USER = 'UNFOLLOW_SHOW_FOR_UNREGISTERED_USER';

export const setIsLoggedInAction = () => (dispatch: any) => {
  dispatch({
    type: SET_IS_LOGGED_IN_TRUE,
  });
};

export const setIsLoggedOutAction = () => (dispatch: any) => {
  dispatch({
    type: SET_IS_LOGGED_IN_FALSE,
  });
};

export const setHasLocalWarningToastBeenShownAction = () => (dispatch: any) => {
  dispatch({
    type: SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN,
  });
};

export const fetchfollowedShowsAction = () => (dispatch: any) =>
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

export const followShowForUnregisteredUserAction = (showId: number) => (dispatch: any) => {
  dispatch({
    type: FOLLOW_SHOW_FOR_UNREGISTERED_USER,
    payload: showId,
  });
};

export const unFollowShowForUnregisteredUserAction = (showId: number) => (dispatch: any) => {
  dispatch({
    type: UNFOLLOW_SHOW_FOR_UNREGISTERED_USER,
    payload: showId,
  });
};
