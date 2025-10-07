import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { setSentryUser } from '~/utils/sentry';

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
      setSentryUser(null);
      state.isLoggedIn = false;
      state.email = '';
    },

    setIsLoggedIn: (
      state,
      action: PayloadAction<{ email: string; isGoogleUser?: boolean }>
    ) => {
      const { email, isGoogleUser = false } = action.payload;
      setSentryUser(email);
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

  extraReducers: builder => {
    builder
      .addCase(incrementBy, (state, action) => {
        // action is inferred correctly here if using TS
      })
      // You can chain calls, or have separate `builder.addCase()` lines each time
      .addCase(decrement, (state, action) => {})
      // You can match a range of action types
      .addMatcher(
        isRejectedAction,
        // `action` will be inferred as a RejectedAction due to isRejectedAction being defined as a type guard
        (state, action) => {}
      )
      // and provide a default case if no other handlers matched
      .addDefaultCase((state, action) => {});
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
