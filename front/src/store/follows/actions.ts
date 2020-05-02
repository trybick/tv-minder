import axios from 'axios';
import { baseUrl } from 'utils/constants';

export const FETCH_USER_FOLLOWS = 'FETCH_USER_FOLLOWS';

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
      .catch((err: Error) => {
        console.log(err);
      });
  };
}
