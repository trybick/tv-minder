import { type Action, type AnyAction, type Reducer } from '@reduxjs/toolkit';

import {
  type DiscoverShowsState,
  SAVE_DISCOVER_SHOWS,
  SAVE_FOR_YOU_SHOWS,
  SAVE_RECOMMENDATIONS,
  SAVE_SEARCH_SHOW_DETAILS,
  SAVE_SHOW_DETAILS_FOR_SHOW,
  SAVE_SHOW_DETAILS_FOR_TRACKED_SHOWS,
  SET_CURRENT_CALENDAR_EPISODES,
  SET_CURRENT_SHOW_ID,
  SET_IS_LOADING_CALENDAR_EPISODES,
  SET_IS_LOADING_SHOW_DETAILS,
} from './actions';
import { type TmdbShowSummary } from './types/tmdbSchema';
import {
  type CalendarEpisode,
  type TmdbShowWithSeasons,
} from './types/transformed';

type State = {
  showDetails: Record<number, TmdbShowWithSeasons>;
  searchShowDetails: Record<number, TmdbShowWithSeasons>;
  currentShowId: number | null;
  isLoadingShowDetails: boolean;
  calendarEpisodesForDisplay: CalendarEpisode[];
  isLoadingCalendarEpisodes: boolean;
  discoverShows: DiscoverShowsState;
  recommendations: Record<number, TmdbShowSummary[]>;
  forYouShows: TmdbShowSummary[];
};

const emptyDiscoverShows: DiscoverShowsState = {
  trending: [],
  newShows: [],
  comingSoon: [],
  mostRated: [],
  highestRated: [],
  netflix: [],
  hbo: [],
  disney: [],
  appleTv: [],
  action: [],
  drama: [],
  sciFi: [],
  documentary: [],
};

const initialState: State = {
  showDetails: {},
  searchShowDetails: {},
  currentShowId: null,
  isLoadingShowDetails: false,
  calendarEpisodesForDisplay: [],
  isLoadingCalendarEpisodes: true,
  discoverShows: emptyDiscoverShows,
  recommendations: {},
  forYouShows: [],
};

export const tvReducer: Reducer<State, Action> = (
  state = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    case SAVE_SHOW_DETAILS_FOR_TRACKED_SHOWS: {
      if (!Object.keys(action.payload ?? {}).length) {
        return state;
      }
      return {
        ...state,
        showDetails: { ...state.showDetails, ...action.payload },
      };
    }
    case SAVE_SHOW_DETAILS_FOR_SHOW: {
      return {
        ...state,
        showDetails: { ...state.showDetails, ...action.payload },
        isLoadingShowDetails: false,
      };
    }
    case SAVE_SEARCH_SHOW_DETAILS: {
      return {
        ...state,
        searchShowDetails: { ...state.searchShowDetails, ...action.payload },
      };
    }
    case SET_CURRENT_SHOW_ID: {
      return {
        ...state,
        currentShowId: action.payload,
      };
    }
    case SET_IS_LOADING_SHOW_DETAILS: {
      if (state.isLoadingShowDetails === action.payload) {
        return state;
      }
      return {
        ...state,
        isLoadingShowDetails: action.payload,
      };
    }
    case SET_CURRENT_CALENDAR_EPISODES: {
      if (state.calendarEpisodesForDisplay === action.payload) {
        return state;
      }
      return {
        ...state,
        calendarEpisodesForDisplay: action.payload,
        isLoadingCalendarEpisodes: false,
      };
    }
    case SET_IS_LOADING_CALENDAR_EPISODES: {
      if (state.isLoadingCalendarEpisodes === action.payload) {
        return state;
      }
      return {
        ...state,
        isLoadingCalendarEpisodes: action.payload,
      };
    }
    case SAVE_DISCOVER_SHOWS: {
      return {
        ...state,
        discoverShows: { ...state.discoverShows, ...action.payload },
      };
    }
    case SAVE_RECOMMENDATIONS: {
      return {
        ...state,
        recommendations: {
          ...state.recommendations,
          [action.payload.showId]: action.payload.results,
        },
      };
    }
    case SAVE_FOR_YOU_SHOWS: {
      return {
        ...state,
        forYouShows: action.payload,
      };
    }
    default:
      return state;
  }
};
