import { tvReducer } from '../reducers';
import {
  REQUEST_BASIC_SHOW_INFO_SUCCEEDED,
  SAVE_EPISODE_DATA,
  SAVE_SEARCH_QUERY,
  SET_CALENDAR_EPISODES,
  SET_POPULAR_SHOWS,
} from '../actions';

describe('tv reducer', () => {
  const blankState = {
    savedQueries: [],
    episodeData: {},
    basicShowInfo: {},
    calendarEpisodesForDisplay: [],
    popularShows: [],
  };

  it('returns expected state on SAVE_SEARCH_QUERY', () => {
    const expectedState = { ...blankState, savedQueries: [{ query: '1' }] };
    const action = { type: SAVE_SEARCH_QUERY, payload: { query: '1' } };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('filters existing query on SAVE_SEARCH_QUERY', () => {
    const expectedState = { ...blankState, savedQueries: [{ query: '1' }] };
    const action = { type: SAVE_SEARCH_QUERY, payload: { query: '1' } };
    expect(tvReducer(blankState as any, action)).toEqual(expectedState);
  });

  it('returns expected state on SAVE_EPISODE_DATA', () => {
    const expectedState = { ...blankState, episodeData: { episode: 'test' } };
    const action = { type: SAVE_EPISODE_DATA, payload: { episode: 'test' } };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('returns expected state on REQUEST_BASIC_SHOW_INFO_SUCCEEDED', () => {
    const expectedState = { ...blankState, basicShowInfo: { 0: { episode: 'test' } } };
    const action = { type: REQUEST_BASIC_SHOW_INFO_SUCCEEDED, payload: [{ episode: 'test' }] };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('returns expected state on SET_CALENDAR_EPISODES', () => {
    const expectedState = { ...blankState, calendarEpisodesForDisplay: [{ episode: 'test' }] };
    const action = { type: SET_CALENDAR_EPISODES, payload: [{ episode: 'test' }] };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('returns expected state on SET_POPULAR_SHOWS', () => {
    const expectedState = { ...blankState, popularShows: [{ episode: 'test' }] };
    const action = { type: SET_POPULAR_SHOWS, payload: [{ episode: 'test' }] };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });
});
