import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/browser';

export type UserState = {
  email: string;
  isGoogleUser: boolean;
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  unregisteredFollowedShows: number[];
};

const initialState: UserState = {
  email: '',
  isGoogleUser: false,
  hasLocalWarningToastBeenShown: false,
  isLoggedIn: false,
  unregisteredFollowedShows: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setHasLocalWarningToastBeenShown: state => {
      state.hasLocalWarningToastBeenShown = true;
    },
    setIsLoggedOut: state => {
      Sentry.setUser(null);
      state.isLoggedIn = false;
      state.email = '';
    },
    setIsLoggedIn: (
      state,
      action: PayloadAction<{ email: string; isGoogleUser?: boolean }>
    ) => {
      const { email, isGoogleUser = false } = action.payload;
      Sentry.setUser({ email });
      state.isLoggedIn = true;
      state.email = email;
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
    selectHasLocalWarningToastBeenShown: state =>
      state.hasLocalWarningToastBeenShown,
    selectIsLoggedIn: state => state.isLoggedIn,
    selectUnregisteredFollowedShows: state => state.unregisteredFollowedShows,
  },
});

export const {
  setHasLocalWarningToastBeenShown,
  setIsLoggedOut,
  setIsLoggedIn,
  unregisteredFollowShow,
  unregisteredUnfollowShow,
} = userSlice.actions;

export const {
  selectEmail,
  selectIsGoogleUser,
  selectHasLocalWarningToastBeenShown,
  selectIsLoggedIn,
  selectUnregisteredFollowedShows,
} = userSlice.selectors;

export default userSlice.reducer;
