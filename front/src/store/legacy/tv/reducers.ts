import { Action, AnyAction, Reducer } from '@reduxjs/toolkit';

import { TmdbShowSummary } from '~/types/tmdbSchema';
import { CalendarEpisode } from '~/types/tvTransformed';

import {
  BasicShowInfoCached,
  PopularShowCached,
  SAVE_BASIC_SHOW_INFO_FOR_FOLLOWED_SHOWS,
  SAVE_BASIC_SHOW_INFO_FOR_SHOW,
  SAVE_CALENDAR_EPISODES_CACHE,
  SAVE_POPULAR_SHOWS,
  SAVE_TOP_RATED_SHOWS,
  SET_CURRENT_CALENDAR_EPISODES,
  SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW,
  SET_IS_LOADING_CALENDAR_EPISODES,
  SET_SEARCH_QUERY,
} from './actions';

export type SavedQuery = {
  query: string;
  results: TmdbShowSummary[];
  timeSaved: string;
  totalResults: number;
};

export type EpisodeCacheEntry = {
  episodes: CalendarEpisode[] | null;
  fetchedAt: string;
};

type State = {
  savedQueries: SavedQuery[];
  episodeData: Record<number, EpisodeCacheEntry>;
  basicShowInfo: Record<number, BasicShowInfoCached>;
  isLoadingBasicShowInfoForShow: boolean;
  calendarEpisodesForDisplay: CalendarEpisode[];
  isLoadingCalendarEpisodes: boolean;
  popularShows: PopularShowCached[];
  topRatedShows: PopularShowCached[];
};

const initialState: State = {
  savedQueries: [],
  episodeData: {},
  basicShowInfo: {},
  isLoadingBasicShowInfoForShow: false,
  calendarEpisodesForDisplay: [],
  isLoadingCalendarEpisodes: true,
  popularShows: [],
  topRatedShows: [],
};

export const tvReducer: Reducer<State, Action> = (
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
        isLoadingCalendarEpisodes: false,
      };
    }
    case SET_IS_LOADING_CALENDAR_EPISODES: {
      return {
        ...state,
        isLoadingCalendarEpisodes: action.payload,
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
