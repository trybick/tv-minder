import { type Action, type AnyAction, type Reducer } from '@reduxjs/toolkit';

import {
  type PopularShowCached,
  SAVE_CALENDAR_EPISODES_CACHE,
  SAVE_POPULAR_SHOWS,
  SAVE_SHOW_DETAILS_FOR_FOLLOWED_SHOWS,
  SAVE_SHOW_DETAILS_FOR_SHOW,
  SAVE_TOP_RATED_SHOWS,
  SET_CURRENT_CALENDAR_EPISODES,
  SET_IS_LOADING_CALENDAR_EPISODES,
  SET_IS_LOADING_SHOW_DETAILS,
  SET_SEARCH_QUERY,
  type ShowDetailsCached,
} from './actions';
import { type CalendarEpisode, type SavedQuery } from './types/transformed';

export type EpisodeCacheEntry = {
  episodes: CalendarEpisode[] | null;
  fetchedAt: string;
};

type State = {
  savedQueries: SavedQuery[];
  episodeData: Record<number, EpisodeCacheEntry>;
  showDetails: Record<number, ShowDetailsCached>;
  isLoadingShowDetails: boolean;
  calendarEpisodesForDisplay: CalendarEpisode[];
  isLoadingCalendarEpisodes: boolean;
  popularShows: PopularShowCached[];
  topRatedShows: PopularShowCached[];
};

const initialState: State = {
  savedQueries: [],
  episodeData: {},
  showDetails: {},
  isLoadingShowDetails: false,
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
