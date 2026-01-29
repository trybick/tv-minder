import {
  type Action,
  configureStore,
  type ThunkAction,
} from '@reduxjs/toolkit';
import {
  type Selector,
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { persistStore } from 'redux-persist';

import { persistedReducer } from './rootReducer';
import { baseApi } from './rtk/api/baseApi';
import { errorHandlerMiddleware } from './rtk/api/errorHandlerMiddleware';
import { type modalsReducer } from './rtk/slices/modals.slice';
import { type recentShowsSlice } from './rtk/slices/recentShows.slice';
import { type searchInputReducer } from './rtk/slices/searchInput.slice';
import { type userReducer } from './rtk/slices/user.slice';
import { type tvReducer } from './tv/reducers';

export type AppState = {
  user: ReturnType<typeof userReducer>;
  tv: ReturnType<typeof tvReducer>;
  searchInput: ReturnType<typeof searchInputReducer>;
  recentShows: ReturnType<typeof recentShowsSlice.reducer>;
  modals: ReturnType<typeof modalsReducer>;
  [baseApi.reducerPath]: ReturnType<typeof baseApi.reducer>;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
      // This is clogging the logs with warnings about state checking taking
      // too long. Re-enable this after migrating to RTK Query
      serializableCheck: false,
      immutableCheck: false,
    }).concat(baseApi.middleware, errorHandlerMiddleware.middleware),
});

export const persistor = persistStore(store);

export type AppSelector<T> = Selector<AppState, T>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
