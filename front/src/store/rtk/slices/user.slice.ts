import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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
  unregisteredFollowedShows: number[];
  token: string | null;
};

const initialState: UserState = {
  email: '',
  isGoogleUser: false,
  isLoggedIn: false,
  unregisteredFollowedShows: [],
  token: authStorage.getToken(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLoggedOut: state => {
      authStorage.clearToken();
      setSentryUser(null);
      state.isLoggedIn = false;
      state.email = '';
      state.token = null;
    },

    setIsLoggedIn: (state, action: PayloadAction<SetIsLoggedInPayload>) => {
      const { email, token, isGoogleUser = false } = action.payload;
      authStorage.setToken(token);
      setSentryUser(email);
      state.isLoggedIn = true;
      state.email = email;
      state.token = token;
      state.isGoogleUser = isGoogleUser;
      state.unregisteredFollowedShows = [];
    },

    unregisteredFollowShow: (state, action: PayloadAction<number>) => {
      const showId = action.payload;
      if (!state.unregisteredFollowedShows.includes(showId)) {
        state.unregisteredFollowedShows.push(showId);
      }
    },

    unregisteredUnfollowShow: (state, action: PayloadAction<number>) => {
      const showId = action.payload;
      state.unregisteredFollowedShows = state.unregisteredFollowedShows.filter(
        id => id !== showId
      );
    },
  },
  selectors: {
    selectEmail: state => state.email,
    selectIsGoogleUser: state => state.isGoogleUser,
    selectIsLoggedIn: state => state.isLoggedIn,
    selectToken: state => state.token,
    selectUnregisteredFollowedShows: state => state.unregisteredFollowedShows,
  },
});

export const {
  setIsLoggedOut,
  setIsLoggedIn,
  unregisteredFollowShow,
  unregisteredUnfollowShow,
} = userSlice.actions;

export const {
  selectEmail,
  selectIsGoogleUser,
  selectIsLoggedIn,
  selectToken,
  selectUnregisteredFollowedShows,
} = userSlice.selectors;

export const userReducer = userSlice.reducer;
