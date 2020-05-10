import { Action, AnyAction, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import storage from 'redux-persist/lib/storage';
import { userReducer, UserState } from './user/reducers';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export type AppThunkDispatch = ThunkDispatch<AppState, void, AnyAction>;

export type AppState = {
  user: UserState;
};

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['user'],
};

const userPersistConfig = {
  key: 'user',
  storage: storage,
  blacklist: ['hasLocalWarningToastBeenShown'],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const middlewares = [thunk];
const appliedMiddleware = applyMiddleware(...middlewares);

export default () => {
  const store = createStore(persistedReducer, composeWithDevTools(appliedMiddleware));
  const persistor = persistStore(store);

  return { store, persistor };
};
