import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const MAX_RECENT_SHOWS = 5;

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
    // Remove if already exists, add to front, and limit size
    addRecentShow: (state, action: PayloadAction<RecentShow>) => {
      state.shows = state.shows.filter(s => s.id !== action.payload.id);
      state.shows.unshift(action.payload);
      state.shows = state.shows.slice(0, MAX_RECENT_SHOWS);
    },
  },
  selectors: {
    selectRecentShows: state => state.shows,
  },
});

export const { addRecentShow } = recentShowsSlice.actions;

export const { selectRecentShows } = recentShowsSlice.selectors;

export const recentShowsReducer = recentShowsSlice.reducer;
