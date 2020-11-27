import { tvReducer } from '../reducers';
import {
  REQUEST_BASIC_SHOW_INFO_SUCCEEDED,
  SAVE_EPISODE_DATA,
  SAVE_SEARCH_QUERY,
  SET_CALENDAR_EPISODES,
} from '../actions';

describe('tv reducer', () => {
  const commonState = {
    savedQueries: [{ query: '1' }],
    episodeData: {},
    basicShowInfo: {},
    calendarEpisodesForDisplay: [],
  };

  it('saves query', () => {
    const action = { type: SAVE_SEARCH_QUERY, payload: { query: '1' } };
    expect(tvReducer(undefined, action)).toEqual(commonState);
  });

  it('does not add same query', () => {
    const initialState = {
      savedQueries: [{ query: '1' }] as any,
      episodeData: {},
      basicShowInfo: {},
      calendarEpisodesForDisplay: [],
    };
    const action = { type: SAVE_SEARCH_QUERY, payload: { query: '1' } };
    expect(tvReducer(initialState, action)).toEqual(commonState);
  });

  it('saves episode data', () => {
    const expectedState = {
      savedQueries: [],
      episodeData: { episode: 'test' },
      basicShowInfo: {},
      calendarEpisodesForDisplay: [],
    };
    const action = { type: SAVE_EPISODE_DATA, payload: { episode: 'test' } };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('returns show info', () => {
    const expectedState = {
      savedQueries: [],
      episodeData: {},
      basicShowInfo: { 0: { episode: 'test' } },
      calendarEpisodesForDisplay: [],
    };
    const action = { type: REQUEST_BASIC_SHOW_INFO_SUCCEEDED, payload: [{ episode: 'test' }] };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('returns calendar episode for display', () => {
    const expectedState = {
      savedQueries: [],
      episodeData: {},
      basicShowInfo: {},
      calendarEpisodesForDisplay: [{ episode: 'test' }],
    };
    const action = { type: SET_CALENDAR_EPISODES, payload: [{ episode: 'test' }] };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });
});
