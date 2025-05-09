import { Action, AnyAction, Reducer } from '@reduxjs/toolkit';

import { CalendarEpisode } from '~/types/external';

import {
  SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS,
  SAVE_BASIC_SHOW_INFO_FOR_SHOW,
  SAVE_CALENDAR_EPISODES_CACHE,
  SAVE_POPULAR_SHOWS,
  SAVE_TOP_RATED_SHOWS,
  SET_CURRENT_CALENDAR_EPISODES,
  SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW,
  SET_SEARCH_QUERY,
} from './actions';
import { SavedQuery } from './types';

export type TvState = {
  savedQueries: SavedQuery[];
  episodeData: Record<number, any>;
  basicShowInfo: Record<number, any>;
  isLoadingBasicShowInfoForShow: boolean;
  calendarEpisodesForDisplay: CalendarEpisode[];
  popularShows: Record<string, any>[];
  topRatedShows: Record<string, any>[];
};

const initialState = {
  savedQueries: [],
  episodeData: {},
  basicShowInfo: {},
  isLoadingBasicShowInfoForShow: false,
  calendarEpisodesForDisplay: [],
  popularShows: [],
  topRatedShows: [],
};

export const tvReducer: Reducer<TvState, Action> = (
  state = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case SET_SEARCH_QUERY: {
      return {
        ...state,
        savedQueries: state.savedQueries
          ? [
              ...state.savedQueries.filter(
                savedQuery => savedQuery.query !== action.payload.query
              ),
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
        isLoadingBasicShowInfoForShow: action.payload,
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
    case SAVE_TOP_RATED_SHOWS: {
      return {
        ...state,
        topRatedShows: action.payload,
      };
    }
    default:
      return state;
  }
};
