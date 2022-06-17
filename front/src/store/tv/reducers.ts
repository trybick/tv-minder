import { Action, AnyAction, Reducer } from 'redux';
import { GenericNumberObject, GenericStringObject } from 'types/common';
import {
  SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS,
  SAVE_BASIC_SHOW_INFO_FOR_SHOW,
  SAVE_CALENDAR_EPISODES_CACHE,
  SAVE_POPULAR_SHOWS,
  SET_CURRENT_CALENDAR_EPISODES,
  SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW,
  SET_SEARCH_QUERY,
} from './actions';
import { SavedQuery } from './types';

export type TvState = {
  savedQueries: SavedQuery[];
  episodeData: GenericNumberObject;
  basicShowInfo: GenericNumberObject;
  isLoadingBasicShowInfoForShow: boolean;
  calendarEpisodesForDisplay: any[];
  popularShows: GenericStringObject[];
};

const initialState = {
  savedQueries: [],
  episodeData: {},
  basicShowInfo: {},
  isLoadingBasicShowInfoForShow: false,
  calendarEpisodesForDisplay: [],
  popularShows: [],
};

export const tvReducer: Reducer<TvState, Action> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_SEARCH_QUERY: {
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
    case SAVE_CALENDAR_EPISODES_CACHE: {
      return {
        ...state,
        episodeData: { ...state.episodeData, ...action.payload },
      };
    }
    case SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS: {
      return {
        ...state,
        basicShowInfo: { ...action.payload },
      };
    }
    case SAVE_BASIC_SHOW_INFO_FOR_SHOW: {
      return {
        ...state,
        basicShowInfo: { ...state.basicShowInfo, ...action.payload },
        isLoadingBasicShowInfoForShow: false,
      };
    }
    case SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW: {
      return {
        ...state,
        isLoadingBasicShowInfoForShow: true,
      };
    }
    case SET_CURRENT_CALENDAR_EPISODES: {
      return {
        ...state,
        calendarEpisodesForDisplay: action.payload,
      };
    }
    case SAVE_POPULAR_SHOWS: {
      return {
        ...state,
        popularShows: action.payload,
      };
    }
    default:
      return state;
  }
};
