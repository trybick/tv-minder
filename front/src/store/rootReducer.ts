import { combineReducers } from '@reduxjs/toolkit';
import localforage from 'localforage';
import { persistReducer } from 'redux-persist';

import searchInputReducer from '~/features/search/searchInputSlice';

import { baseApi } from './api/baseApi';
import { tvReducer } from './tv/reducers';
import userReducer from './user/user.slice';

// Why use redux-perist?
// The main reason to use redux-persist is to persist the 'logged in' state.
// We also persist all the TV data to cut down on API calls.

// There is some weirdness with the persist config whitelist and blacklist. The
// way to get it work seems to be blacklist all keys AND blacklist nested keys.
const rootPersistConfig = {
  key: 'root',
  storage: localforage,
  blacklist: ['user', 'tv', 'searchInput', baseApi.reducerPath],
};

const userPersistConfig = {
  key: 'user',
  storage: localforage,
  blacklist: ['hasLocalWarningToastBeenShown'],
};

const tvPersistConfig = {
  key: 'tv',
  storage: localforage,
};

const searchInputPersistConfig = {
  key: 'searchInput',
  storage: localforage,
  blacklist: ['shouldResetSearchInput'],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  tv: persistReducer(tvPersistConfig, tvReducer),
  searchInput: persistReducer(searchInputPersistConfig, searchInputReducer),
  [baseApi.reducerPath]: baseApi.reducer,
});

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
