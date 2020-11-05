import moment from 'moment';
import * as actions from '../actions';
import { returnWithStore } from './test-config';
import { SavedQuery } from '../types';

describe('tv actions', () => {
  const user = {
    followedShows: [],
    isLoggedIn: true,
    unregisteredFollowedShows: [],
  };
  const tv = {
    episodeData: {
      1: { episodes: 'test' },
    },
  };
  const mockStore = returnWithStore({ user, tv });
  beforeEach(mockStore.clearActions);

  it('dispatches correct state with saveSearchQueryAction', () => {
    const query: SavedQuery = { query: 'test', results: [], timeSaved: moment(), totalResults: 1 };
    const expectedState = [{ type: actions.SAVE_SEARCH_QUERY, payload: query }];
    mockStore.dispatch<any>(actions.saveSearchQueryAction(query));
    expect(mockStore.getActions()).toEqual(expectedState);
  });

  it('dispatches correct state with saveEpisodeDataAction', () => {
    const episodeData: any = 'test';
    const expectedState = [{ type: actions.SAVE_EPISODE_DATA, payload: episodeData }];
    mockStore.dispatch<any>(actions.saveEpisodeDataAction(episodeData));
    expect(mockStore.getActions()).toEqual(expectedState);
  });

  it('dispatches correct state with setCalendarEpisodesAction', () => {
    const episodesForDisplay: any = 'test';
    const expectedState = [{ type: actions.SET_CALENDAR_EPISODES, payload: episodesForDisplay }];
    mockStore.dispatch<any>(actions.setCalendarEpisodesAction(episodesForDisplay));
    expect(mockStore.getActions()).toEqual(expectedState);
  });

  it('dispatches correct state with loadEpisodesForCalendar', async () => {
    const expectedState = [{ type: actions.SET_CALENDAR_EPISODES, payload: [] }];
    await mockStore.dispatch<any>(actions.loadEpisodesForCalendar());
    expect(mockStore.getActions()).toEqual(expectedState);
  });

  it('dispatches correct state with requestBasicShowInfoAction', async () => {
    const expectedState = [{ type: actions.REQUEST_BASIC_SHOW_INFO_SUCCEEDED, payload: {} }];
    await mockStore.dispatch<any>(actions.requestBasicShowInfoAction());
    expect(mockStore.getActions()).toEqual(expectedState);
  });
});
