import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { followReducer, FollowReducerState } from './follows/reducers';
import { userReducer, UserReducerState } from './user/reducers';

export type AppState = {
  followReducer: FollowReducerState;
  userReducer: UserReducerState;
};

const rootReducer = combineReducers({
  followReducer,
  userReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middlewares = [thunk];
const appliedMiddleware = applyMiddleware(...middlewares);

export default () => {
  const store = createStore(persistedReducer, composeWithDevTools(appliedMiddleware));
  const persistor = persistStore(store);

  return { store, persistor };
};
