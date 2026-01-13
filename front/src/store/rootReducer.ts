import { combineReducers } from '@reduxjs/toolkit';
import localforage from 'localforage';
import { persistReducer } from 'redux-persist';

import { baseApi } from './rtk/api/baseApi';
import { modalsReducer } from './rtk/slices/modals.slice';
import { searchInputReducer } from './rtk/slices/searchInput.slice';
import { userReducer } from './rtk/slices/user.slice';
import { tvReducer } from './tv/reducers';

// Why use redux-perist?
// The main reason to use redux-persist is to persist the 'logged in' state.
// We also persist all the TV data to cut down on API calls.

// There is some weirdness with the persist config whitelist and blacklist. The
// way to get it work seems to be blacklist all keys AND blacklist nested keys.
const rootPersistConfig = {
  key: 'root',
  storage: localforage,
  blacklist: ['user', 'tv', 'searchInput', 'modals', baseApi.reducerPath],
};

const userPersistConfig = {
  key: 'user',
  storage: localforage,
  blacklist: [],
};

const tvPersistConfig = {
  key: 'tv',
  storage: localforage,
  blacklist: ['isLoadingCalendarEpisodes', 'isLoadingShowDetails'],
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
  modals: modalsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
