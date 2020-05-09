import axios from 'axios';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';

export const SET_IS_LOGGED_IN_TRUE = 'SET_IS_LOGGED_IN_TRUE';
export const SET_IS_LOGGED_IN_FALSE = 'SET_IS_LOGGED_IN_FALSE';
export const SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN = 'SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN';
export const FETCH_USER_FOLLOWS = 'FETCH_USER_FOLLOWS';
export const UNREGISTERED_FOLLOW_SHOW = 'UNREGISTERED_FOLLOW_SHOW';
export const UNREGISTERED_UNFOLLOW_SHOW = 'UNREGISTERED_UNFOLLOW_SHOW';
export const FOLLOW_SHOW = 'FOLLOW_SHOW';
export const UNFOLLOW_SHOW = 'UNFOLLOW_SHOW';
export const UNREGISTERED_CLEAR_FOLLOWED_SHOWS = 'UNREGISTERED_CLEAR_FOLLOWED_SHOWS';

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

export const unregisteredFollowShowAction = (showId: string) => (dispatch: any) => {
  dispatch({
    type: UNREGISTERED_FOLLOW_SHOW,
    payload: showId,
  });
};

export const unregisteredUnFollowShowAction = (showId: string) => (dispatch: any) => {
  dispatch({
    type: UNREGISTERED_UNFOLLOW_SHOW,
    payload: showId,
  });
};

export const unregisteredClearFollowedShowsAction = () => (dispatch: any) => {
  dispatch({
    type: UNREGISTERED_CLEAR_FOLLOWED_SHOWS,
  });
};

export const followShowAction = (showId: string) => (dispatch: any) => {
  dispatch({
    type: FOLLOW_SHOW,
    payload: showId,
  });
};

export const unFollowShowAction = (showId: string) => (dispatch: any) => {
  dispatch({
    type: UNFOLLOW_SHOW,
    payload: showId,
  });
};
