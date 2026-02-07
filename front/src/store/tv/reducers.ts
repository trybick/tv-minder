import { type Action, type AnyAction, type Reducer } from '@reduxjs/toolkit';

import {
  type DiscoverShowsState,
  SAVE_CALENDAR_EPISODES_CACHE,
  SAVE_DISCOVER_SHOWS,
  SAVE_SEARCH_SHOW_DETAILS,
  SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS,
  SAVE_SHOW_DETAILS_FOR_SHOW,
  SET_CURRENT_CALENDAR_EPISODES,
  SET_IS_LOADING_CALENDAR_EPISODES,
  SET_IS_LOADING_SHOW_DETAILS,
  SET_SEARCH_QUERY,
} from './actions';
import {
  type CalendarEpisode,
  type SavedQuery,
  type TmdbShowWithSeasons,
} from './types/transformed';

export type EpisodeCacheEntry = {
  episodes: CalendarEpisode[] | null;
};

type State = {
  savedQueries: SavedQuery[];
  episodeData: Record<number, EpisodeCacheEntry>;
  showDetails: Record<number, TmdbShowWithSeasons>;
  searchShowDetails: Record<number, TmdbShowWithSeasons>;
  isLoadingShowDetails: boolean;
  calendarEpisodesForDisplay: CalendarEpisode[];
  isLoadingCalendarEpisodes: boolean;
  discoverShows: DiscoverShowsState;
};

const emptyDiscoverShows: DiscoverShowsState = {
  trending: [],
  airingThisWeek: [],
  newShows: [],
  comingSoon: [],
  returningThisMonth: [],
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
  savedQueries: [],
  episodeData: {},
  showDetails: {},
  searchShowDetails: {},
  isLoadingShowDetails: false,
  calendarEpisodesForDisplay: [],
  isLoadingCalendarEpisodes: true,
  discoverShows: emptyDiscoverShows,
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
    case SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS: {
      return {
        ...state,
        showDetails: { ...action.payload },
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
    case SET_IS_LOADING_SHOW_DETAILS: {
      return {
        ...state,
        isLoadingShowDetails: action.payload,
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
    case SAVE_DISCOVER_SHOWS: {
      return {
        ...state,
        discoverShows: { ...state.discoverShows, ...action.payload },
      };
    }
    default:
      return state;
  }
};
