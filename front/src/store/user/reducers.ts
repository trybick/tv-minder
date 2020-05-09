import { Action, Reducer } from 'redux';
import {
  FETCH_USER_FOLLOWS,
  FOLLOW_SHOW_FOR_UNREGISTERED_USER,
  SET_IS_LOGGED_IN_TRUE,
  SET_IS_LOGGED_IN_FALSE,
  SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN,
  UNFOLLOW_SHOW_FOR_UNREGISTERED_USER,
} from './actions';

export interface UserReducerState {
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  followedShows: any[];
  followedShowsForUnregisteredUser: any[];
}

const initialState = {
  hasLocalWarningToastBeenShown: false,
  isLoggedIn: false,
  followedShows: [],
  followedShowsForUnregisteredUser: [],
};

export const userReducer: Reducer<UserReducerState, Action> = (
  state = initialState,
  action: any
) => {
  switch (action.type) {
    case FETCH_USER_FOLLOWS: {
      return {
        ...state,
        followedShows: action.payload,
      };
    }
    case FOLLOW_SHOW_FOR_UNREGISTERED_USER: {
      if (!state.followedShowsForUnregisteredUser.includes(action.payload)) {
        return {
          ...state,
          followedShowsForUnregisteredUser: [
            ...state.followedShowsForUnregisteredUser,
            action.payload,
          ],
        };
      }
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
        followedShows: [],
      };
    }
    case UNFOLLOW_SHOW_FOR_UNREGISTERED_USER: {
      return {
        ...state,
        followedShowsForUnregisteredUser: state.followedShowsForUnregisteredUser.filter(
          (showId) => showId !== action.payload
        ),
      };
    }
    default:
      return state;
  }
};
