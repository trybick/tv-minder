import { Action, Reducer } from 'redux';
import { FETCH_USER_FOLLOWS, SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN } from './actions';
import { AppState } from 'store';

const initialState = {
  followReducer: {
    hasLocalWarningToastBeenShown: false,
    userFollows: [],
  },
};

export interface FollowReducerState {
  hasLocalWarningToastBeenShown: boolean;
  userFollows: any[];
}

export const followReducer: Reducer<AppState, Action> = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_USER_FOLLOWS: {
      return {
        ...state,
        userFollows: action.payload,
      };
    }
    case SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN: {
      return {
        ...state,
        hasLocalWarningToastBeenShown: true,
      };
    }
    default:
      return state;
  }
};
