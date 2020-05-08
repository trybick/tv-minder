import { Action, Reducer } from 'redux';
import { SET_IS_LOGGED_IN_TRUE, SET_IS_LOGGED_IN_FALSE } from './actions';

export interface UserReducerState {
  isLoggedIn: boolean;
}

const initialState = {
  isLoggedIn: false,
};

export const userReducer: Reducer<UserReducerState, Action> = (
  state = initialState,
  action: any
) => {
  switch (action.type) {
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
