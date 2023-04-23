import {
  Action,
  AnyAction,
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from 'redux';
import { useDispatch } from 'react-redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import localforage from 'localforage';
import { userReducer, UserState } from './user/reducers';
import { tvReducer, TvState } from './tv/reducers';
import { PlainFunction } from 'types/common';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
export type AppThunkDispatch = ThunkDispatch<AppState, void, AnyAction>;
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
const middlewares = [thunk];
const appliedMiddleware = applyMiddleware(...middlewares);

export const store = createStore(persistedReducer, composeWithDevTools(appliedMiddleware));
export const persistor = persistStore(store);
