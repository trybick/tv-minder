import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { type AppState } from '~/store';

const MAX_RECENT_SHOWS = 8;

type RecentShow = {
  id: number;
  name: string;
  posterPath: string | null;
};

type RecentShowsState = {
  shows: RecentShow[];
};

const initialState: RecentShowsState = {
  shows: [],
};

export const recentShowsSlice = createSlice({
  name: 'recentShows',
  initialState,
  reducers: {
    addRecentShow: (state, action: PayloadAction<RecentShow>) => {
      // Remove if already exists
      state.shows = state.shows.filter(s => s.id !== action.payload.id);
      // Add to front
      state.shows.unshift(action.payload);
      // Limit size
      state.shows = state.shows.slice(0, MAX_RECENT_SHOWS);
    },
    clearRecentShows: state => {
      state.shows = [];
    },
  },
});

export const { addRecentShow, clearRecentShows } = recentShowsSlice.actions;

// Selectors
const selectRecentShowsState = (state: AppState) => state.recentShows;

export const selectRecentShows = createSelector(
  selectRecentShowsState,
  state => state.shows
);
