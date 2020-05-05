import axios from 'axios';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';

export const FETCH_USER_FOLLOWS = 'FETCH_USER_FOLLOWS';
export const SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN = 'SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN';

export function fetchUserFollows() {
  return (dispatch: any) => {
    const token = localStorage.getItem('jwt');

    return axios
      .get(`${baseUrl}/follow`, {
        params: { token },
      })
      .then(({ data }) => {
        dispatch({
          type: FETCH_USER_FOLLOWS,
          payload: data,
        });
      })
      .catch(handleErrors);
  };
}

export function setHasLocalWarningToastBeenShown() {
  return (dispatch: any) => {
    dispatch({
      type: SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN,
    });
  };
}
