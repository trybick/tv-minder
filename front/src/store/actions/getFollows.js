import axios from 'axios';
import { baseUrl } from 'utils/constants';

export const FETCH_USER_FOLLOWS = 'FETCH_USER_FOLLOWS';

export function fetchUserFollows() {
  return (dispatch) => {
    console.log('dispatch:', dispatch);
    return axios.get(`${baseUrl}/follow`).then(({ data }) => {
      console.log('data:', data);
      // dispatch({
      //   type: FETCH_USER_FOLLOWS,
      //   payload: data.followedShows,
      // });
      dispatch(setUserFollows(data.followedShows));
    });
  };
}

function setUserFollows(followedShows) {
  return {
    type: FETCH_USER_FOLLOWS,
    payload: followedShows,
  };
}
