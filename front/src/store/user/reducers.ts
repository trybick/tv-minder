import { Action, Reducer } from 'redux';
import {
  FETCH_USER_FOLLOWS,
  UNREGISTERED_FOLLOW_SHOW,
  SET_IS_LOGGED_IN_TRUE,
  SET_IS_LOGGED_IN_FALSE,
  SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN,
  UNREGISTERED_UNFOLLOW_SHOW,
  SAVE_TO_FOLLOWED_SHOWS,
  REMOVE_FROM_FOLLOWED_SHOWS,
  UNREGISTERED_CLEAR_FOLLOWED_SHOWS,
} from './actions';

export interface UserReducerState {
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  followedShows: any[];
  unregisteredFollowedShows: any[];
}

const initialState = {
  hasLocalWarningToastBeenShown: false,
  isLoggedIn: false,
  followedShows: [],
  unregisteredFollowedShows: [],
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
    case SAVE_TO_FOLLOWED_SHOWS: {
      if (!state.followedShows.includes(action.payload)) {
        return {
          ...state,
          followedShows: [...state.followedShows, action.payload],
        };
      }
    }
    case UNREGISTERED_FOLLOW_SHOW: {
      if (!state.unregisteredFollowedShows.includes(action.payload)) {
        return {
          ...state,
          unregisteredFollowedShows: [...state.unregisteredFollowedShows, action.payload],
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
    case REMOVE_FROM_FOLLOWED_SHOWS: {
      return {
        ...state,
        followedShows: state.followedShows.filter((showId) => showId !== action.payload),
      };
    }
    case UNREGISTERED_UNFOLLOW_SHOW: {
      return {
        ...state,
        unregisteredFollowedShows: state.unregisteredFollowedShows.filter(
          (showId) => showId !== action.payload
        ),
      };
    }
    case UNREGISTERED_CLEAR_FOLLOWED_SHOWS: {
      return {
        ...state,
        unregisteredFollowedShows: [],
      };
    }
    default:
      return state;
  }
};
