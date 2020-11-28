import { Action, AnyAction, Reducer } from 'redux';
import {
  REQUEST_BASIC_SHOW_INFO_SUCCEEDED,
  SAVE_EPISODE_DATA,
  SAVE_SEARCH_QUERY,
  SET_CALENDAR_EPISODES,
  SET_POPULAR_SHOWS,
} from './actions';
import { SavedQuery } from './types';

export interface TvState {
  savedQueries: SavedQuery[];
  episodeData: { [key: number]: any };
  basicShowInfo: { [key: number]: any };
  calendarEpisodesForDisplay: any[];
  popularShows: Array<{ [key: string]: any }>;
}

const initialState = {
  savedQueries: [],
  episodeData: {},
  basicShowInfo: {},
  calendarEpisodesForDisplay: [],
  popularShows: [],
};

export const tvReducer: Reducer<TvState, Action> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SAVE_SEARCH_QUERY: {
      return {
        ...state,
        savedQueries: state.savedQueries
          ? [
              ...state.savedQueries.filter(savedQuery => savedQuery.query !== action.payload.query),
              action.payload,
            ]
          : [action.payload],
      };
    }
    case SAVE_EPISODE_DATA: {
      return {
        ...state,
        episodeData: { ...state.episodeData, ...action.payload },
      };
    }
    case REQUEST_BASIC_SHOW_INFO_SUCCEEDED: {
      return {
        ...state,
        basicShowInfo: { ...action.payload },
      };
    }
    case SET_CALENDAR_EPISODES: {
      return {
        ...state,
        calendarEpisodesForDisplay: action.payload,
      };
    }
    case SET_POPULAR_SHOWS: {
      return {
        ...state,
        popularShows: action.payload,
      };
    }
    default:
      return state;
  }
};
