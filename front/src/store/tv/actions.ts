import { AppThunk } from 'store';
import { SavedQuery } from './types';

export const SAVE_SEARCH_QUERY = 'SAVE_SEARCH_QUERY';
export const SAVE_EPISODE_DATA = 'SAVE_EPISODE_DATA';

export const saveSearchQueryAction = (query: SavedQuery): AppThunk => dispatch => {
  dispatch({
    type: SAVE_SEARCH_QUERY,
    payload: query,
  });
};

export const saveEpisodeDataAction = (episodeData: any): AppThunk => dispatch => {
  dispatch({
    type: SAVE_EPISODE_DATA,
    payload: episodeData,
  });
};
