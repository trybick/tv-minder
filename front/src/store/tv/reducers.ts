import { Action, Reducer, AnyAction } from 'redux';
import { AppState } from 'store';
import { SAVE_SEARCH_QUERY, SAVE_EPISODE_DATA } from './actions';
import { SavedQuery } from './types';

export interface TvState {
  savedQueries: SavedQuery[];
  episodeData: { [key: number]: any };
}

const initialState = {
  savedQueries: [],
  episodeData: {},
};

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;

export const tvReducer: Reducer<TvState, Action> = (state = initialState, action: AnyAction) => {
  console.log('cache reducer:', action.payload);

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
    default:
      return state;
  }
};
