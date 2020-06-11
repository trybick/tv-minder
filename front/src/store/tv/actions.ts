import { AppThunk } from 'store';
import { SavedQuery } from 'components/search/SearchPage';

export const SAVE_SEARCH_QUERY = 'SAVE_SEARCH_QUERY';

export const saveSearchQueryAction = (query: SavedQuery): AppThunk => dispatch => {
  dispatch({
    type: SAVE_SEARCH_QUERY,
    payload: query,
  });
};
