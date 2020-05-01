import axios from 'axios';
import { baseUrl } from 'utils/constants';

export const FETCH_USER_FOLLOWS = 'FETCH_USER_FOLLOWS';

export function fetchUserFollows() {
  return (dispatch) => {
    const token = localStorage.getItem('jwt');
    console.log('token:', token);

    return axios
      .get(`${baseUrl}/follow`, {
        params: { token },
      })
      .then(({ data }) => {
        console.log('data:', data);
        dispatch({
          type: FETCH_USER_FOLLOWS,
          payload: data.followedShows,
        });
      });
  };
}
