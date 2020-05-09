import { Action, Reducer } from 'redux';
import {
  FETCH_USER_FOLLOWS,
  SET_IS_LOGGED_IN_TRUE,
  SET_IS_LOGGED_IN_FALSE,
  SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN,
} from './actions';

export interface UserReducerState {
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  userFollows: any[];
}

const initialState = {
  hasLocalWarningToastBeenShown: false,
  isLoggedIn: false,
  userFollows: [],
};

export const userReducer: Reducer<UserReducerState, Action> = (
  state = initialState,
  action: any
) => {
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
    case SET_IS_LOGGED_IN_TRUE: {
      return {
        ...state,
        isLoggedIn: true,
      };
    }
    case SET_IS_LOGGED_IN_FALSE: {
      return {
        ...state,
        isLoggedIn: false,
      };
    }
    default:
      return state;
  }
};
