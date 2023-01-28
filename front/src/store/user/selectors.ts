import { AppState } from 'store';

export const selectFollowedShows = (state: AppState) =>
  state.user.isLoggedIn ? state.user.followedShows : state.user.unregisteredFollowedShows;

export const selectHasLocalWarningToastBeenShown = (state: AppState) =>
  state.user.hasLocalWarningToastBeenShown;

export const selectIsLoggedIn = (state: AppState) => state.user.isLoggedIn;

export const selectUserEmail = (state: AppState) => state.user.email;

export const selectIsGoogleUser = (state: AppState) => state.user?.isGoogleUser;

export const selectUnregisteredFollowedShows = (state: AppState) =>
  state.user.unregisteredFollowedShows;
