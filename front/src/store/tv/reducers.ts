import { Action, Reducer, AnyAction } from 'redux';
import { REQUEST_BASIC_SHOW_INFO_SUCCEEDED, SAVE_SEARCH_QUERY, SAVE_EPISODE_DATA } from './actions';
import { SavedQuery } from './types';

export interface TvState {
  savedQueries: SavedQuery[];
  episodeData: { [key: number]: any };
  basicShowInfo: { [key: number]: any };
}

const initialState = {
  savedQueries: [],
  episodeData: {},
  basicShowInfo: {},
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
        basicShowInfo: { ...state.basicShowInfo, ...action.payload },
      };
    }
    default:
      return state;
  }
};
