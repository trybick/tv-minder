import { FETCH_USER_FOLLOWS } from './actions';

const initialState = {
  userFollows: [],
};

export function userFollowsReducer(state = initialState, action: any) {
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
