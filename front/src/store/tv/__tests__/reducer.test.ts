import { tvReducer } from '../reducers';
import {
  REQUEST_BASIC_SHOW_INFO_SUCCEEDED,
  SAVE_EPISODE_DATA,
  SAVE_SEARCH_QUERY,
  SET_CALENDAR_EPISODES,
  SET_POPULAR_SHOWS,
} from '../actions';

describe('tv reducer', () => {
  //this state is used for SAVE_SEARCH_QUERY tests
  const commonState = {
    savedQueries: [{ query: '1' }],
    episodeData: {},
    basicShowInfo: {},
    calendarEpisodesForDisplay: [],
    popularShows: [],
  };

  it('returns expected state on SAVE_SEARCH_QUERY', () => {
    const action = { type: SAVE_SEARCH_QUERY, payload: { query: '1' } };
    expect(tvReducer(undefined, action)).toEqual(commonState);
  });

  it('filters existing query on SAVE_SEARCH_QUERY', () => {
    const action = { type: SAVE_SEARCH_QUERY, payload: { query: '1' } };
    expect(tvReducer(commonState as any, action)).toEqual(commonState);
  });

  it('returns expected state on SAVE_EPISODE_DATA', () => {
    const expectedState = {
      savedQueries: [],
      episodeData: { episode: 'test' },
      basicShowInfo: {},
      popularShows: [],
      calendarEpisodesForDisplay: [],
    };
    const action = { type: SAVE_EPISODE_DATA, payload: { episode: 'test' } };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('returns expected state on REQUEST_BASIC_SHOW_INFO_SUCCEEDED', () => {
    const expectedState = {
      savedQueries: [],
      episodeData: {},
      popularShows: [],
      basicShowInfo: { 0: { episode: 'test' } },
      calendarEpisodesForDisplay: [],
    };
    const action = { type: REQUEST_BASIC_SHOW_INFO_SUCCEEDED, payload: [{ episode: 'test' }] };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('returns expected state on SET_CALENDAR_EPISODES', () => {
    const expectedState = {
      savedQueries: [],
      episodeData: {},
      basicShowInfo: {},
      popularShows: [],
      calendarEpisodesForDisplay: [{ episode: 'test' }],
    };
    const action = { type: SET_CALENDAR_EPISODES, payload: [{ episode: 'test' }] };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });

  it('returns expected state on SET_POPULAR_SHOWS', () => {
    const expectedState = {
      savedQueries: [],
      episodeData: {},
      basicShowInfo: {},
      popularShows: [{ episode: 'test' }],
      calendarEpisodesForDisplay: [],
    };
    const action = { type: SET_POPULAR_SHOWS, payload: [{ episode: 'test' }] };
    expect(tvReducer(undefined, action)).toEqual(expectedState);
  });
});
