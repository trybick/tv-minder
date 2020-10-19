import { SAVE_SEARCH_QUERY, saveSearchQueryAction } from '../actions';
import { returnWithStore } from '../config';
import { SavedQuery } from '../types';
import moment from 'moment';

describe('tv actions', () => {
  const mockStore = returnWithStore();
  it('dispatches correct state @saveSearchQueryAction', () => {
    const query: SavedQuery = { query: 'test', results: [], timeSaved: moment(), totalResults: 1 };
    const expectedState = [{ type: SAVE_SEARCH_QUERY, payload: query }];
    mockStore.dispatch<any>(saveSearchQueryAction(query));
    expect(mockStore.getActions()).toEqual(expectedState);
  });
});
