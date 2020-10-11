import { Action, AnyAction, Reducer } from 'redux';
import {
  FETCH_USER_FOLLOWS,
  REMOVE_FROM_FOLLOWED_SHOWS,
  SAVE_TO_FOLLOWED_SHOWS,
  SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN,
  SET_IS_LOGGED_IN_FALSE,
  SET_IS_LOGGED_IN_TRUE,
  UNREGISTERED_CLEAR_FOLLOWED_SHOWS,
  UNREGISTERED_REMOVE_FROM_FOLLOWED_SHOWS,
  UNREGISTERED_SAVE_TO_FOLLOWED_SHOWS,
} from './actions';
import { ID } from 'types/common';

export interface UserState {
  email: string;
  followedShows: ID[];
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  unregisteredFollowedShows: ID[];
}

const initialState = {
  email: '',
  followedShows: [],
  hasLocalWarningToastBeenShown: false,
  isLoggedIn: false,
  unregisteredFollowedShows: [],
};

export const userReducer: Reducer<UserState, Action> = (
  state = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case FETCH_USER_FOLLOWS: {
      return {
        ...state,
        followedShows: action.payload,
      };
    }
    case REMOVE_FROM_FOLLOWED_SHOWS: {
      return {
        ...state,
        followedShows: state.followedShows.filter(showId => showId !== action.payload),
      };
    }
    case SAVE_TO_FOLLOWED_SHOWS: {
      return !state.followedShows.includes(action.payload)
        ? {
            ...state,
            followedShows: [...state.followedShows, action.payload],
          }
        : state;
    }
    case SET_IS_LOGGED_IN_FALSE: {
      return {
        ...state,
        isLoggedIn: false,
        followedShows: [],
        email: '',
      };
    }
    case SET_IS_LOGGED_IN_TRUE: {
      return {
        ...state,
        isLoggedIn: true,
        email: action.payload,
      };
    }
    case SET_HAS_LOCAL_WARNING_TOAST_BEEN_SHOWN: {
      return {
        ...state,
        hasLocalWarningToastBeenShown: true,
      };
    }
    case UNREGISTERED_CLEAR_FOLLOWED_SHOWS: {
      return {
        ...state,
        unregisteredFollowedShows: [],
      };
    }
    case UNREGISTERED_REMOVE_FROM_FOLLOWED_SHOWS: {
      return {
        ...state,
        unregisteredFollowedShows: state.unregisteredFollowedShows.filter(
          showId => showId !== action.payload
        ),
      };
    }
    case UNREGISTERED_SAVE_TO_FOLLOWED_SHOWS: {
      return !state.unregisteredFollowedShows.includes(action.payload)
        ? {
            ...state,
            unregisteredFollowedShows: [...state.unregisteredFollowedShows, action.payload],
          }
        : state;
    }
    default:
      return state;
  }
};
