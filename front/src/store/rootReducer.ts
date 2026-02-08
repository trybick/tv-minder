import { combineReducers } from '@reduxjs/toolkit';
import localforage from 'localforage';
import { persistReducer } from 'redux-persist';

import { baseApi } from './rtk/api/baseApi';
import { modalsReducer } from './rtk/slices/modals.slice';
import { recentShowsReducer } from './rtk/slices/recentShows.slice';
import { searchInputReducer } from './rtk/slices/searchInput.slice';
import { userReducer } from './rtk/slices/user.slice';
import { tvReducer } from './tv/reducers';

// Redux Persist is used for small UI/session state (login, preferences).
// TV/TMDB data is NOT persisted here — it's cached at the network layer
// by the service worker (see vite.config.ts runtimeCaching).

// There is some weirdness with the persist config whitelist and blacklist. The
// way to get it work seems to be blacklist all keys AND blacklist nested keys.
const rootPersistConfig = {
  key: 'root',
  storage: localforage,
  blacklist: [
    'user',
    'tv',
    'searchInput',
    'modals',
    'recentShows',
    baseApi.reducerPath,
  ],
};

const userPersistConfig = {
  key: 'user',
  storage: localforage,
  blacklist: [],
};

const searchInputPersistConfig = {
  key: 'searchInput',
  storage: localforage,
  blacklist: ['shouldResetSearchInput'],
};

const recentShowsPersistConfig = {
  key: 'recentShows',
  storage: localforage,
  blacklist: [],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  tv: tvReducer,
  searchInput: persistReducer(searchInputPersistConfig, searchInputReducer),
  recentShows: persistReducer(recentShowsPersistConfig, recentShowsReducer),
  modals: modalsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
