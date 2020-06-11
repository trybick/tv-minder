import { Action, Reducer, AnyAction } from 'redux';
import { AppState } from 'store';
import { SAVE_SEARCH_QUERY } from './actions';
import { SavedQuery } from 'components/search/SearchPage';

export interface TvState {
  savedQueries: SavedQuery[];
}

const initialState = {
  savedQueries: [],
};

export const selectSavedQueries = (state: AppState) => state.tv.savedQueries;

export const tvReducer: Reducer<TvState, Action> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SAVE_SEARCH_QUERY: {
      return {
        ...state,
        savedQueries: [...state.savedQueries, action.payload],
      };
    }
    default:
      return state;
  }
};
