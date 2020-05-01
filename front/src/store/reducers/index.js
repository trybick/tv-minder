import { FETCH_USER_FOLLOWS } from '../actions/getFollows';

const initialState = {
  userFollows: [],
};

export function userFollowsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_FOLLOWS: {
      return {
        ...state,
        userFollows: action.payload,
      };
    }
    default:
      return state;
  }
}
