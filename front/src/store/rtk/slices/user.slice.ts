import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { setAnalyticsUserId } from '~/utils/analytics';
import { authStorage } from '~/utils/authStorage';
import { setSentryUser } from '~/utils/sentry';

type SetIsLoggedInPayload = {
  email: string;
  token: string;
  isGoogleUser?: boolean;
};

export type UserState = {
  email: string;
  isGoogleUser: boolean;
  isLoggedIn: boolean;
  unregisteredTrackedShows: number[];
  token: string | null;
};

const initialState: UserState = {
  email: '',
  isGoogleUser: false,
  isLoggedIn: false,
  unregisteredTrackedShows: [],
  token: authStorage.getToken(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedOut: state => {
      authStorage.clearToken();
      setSentryUser(null);
      setAnalyticsUserId(null);
      state.isLoggedIn = false;
      state.email = '';
      state.token = null;
    },

    setIsLoggedIn: (state, action: PayloadAction<SetIsLoggedInPayload>) => {
      const { email, token, isGoogleUser = false } = action.payload;
      authStorage.setToken(token);
      setSentryUser(email);
      setAnalyticsUserId(email);
      state.isLoggedIn = true;
      state.email = email;
      state.token = token;
      state.isGoogleUser = isGoogleUser;
      state.unregisteredTrackedShows = [];
    },

    unregisteredTrackShow: (state, action: PayloadAction<number>) => {
      const showId = action.payload;
      if (!state.unregisteredTrackedShows.includes(showId)) {
        state.unregisteredTrackedShows.push(showId);
      }
    },

    unregisteredUntrackShow: (state, action: PayloadAction<number>) => {
      const showId = action.payload;
      state.unregisteredTrackedShows = state.unregisteredTrackedShows.filter(
        id => id !== showId
      );
    },
  },
  selectors: {
    selectEmail: state => state.email,
    selectIsGoogleUser: state => state.isGoogleUser,
    selectIsLoggedIn: state => state.isLoggedIn,
    selectToken: state => state.token,
    selectUnregisteredTrackedShows: state => state.unregisteredTrackedShows,
  },
});

export const {
  setIsLoggedOut,
  setIsLoggedIn,
  unregisteredTrackShow,
  unregisteredUntrackShow,
} = userSlice.actions;

export const {
  selectEmail,
  selectIsGoogleUser,
  selectIsLoggedIn,
  selectToken,
  selectUnregisteredTrackedShows,
} = userSlice.selectors;

export const userReducer = userSlice.reducer;
