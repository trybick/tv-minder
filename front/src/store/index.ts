import localforage from 'localforage';
import { useDispatch } from 'react-redux';
import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore as createStore,
} from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk, ThunkAction, ThunkDispatch } from 'redux-thunk';

import { PlainFunction } from '~/types/common';

import { tvReducer, TvState } from './tv/reducers';
import { userReducer, UserState } from './user/reducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, Action>;
export type AppThunkPlainAction = PlainFunction;

export const useAppDispatch: () => AppThunkDispatch = useDispatch;

export type AppState = {
  user: UserState;
  tv: TvState;
};

const rootPersistConfig = {
  key: 'root',
  storage: localforage,
  blacklist: ['user', 'tv'],
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

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  tv: persistReducer(tvPersistConfig, tvReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);
export const persistor = persistStore(store);
