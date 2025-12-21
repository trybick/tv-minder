import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import {
  Selector,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { persistStore } from 'redux-persist';

import { persistedReducer } from './rootReducer';
import { baseApi } from './rtk/api/baseApi';
import { errorHandlerMiddleware } from './rtk/api/errorHandlerMiddleware';
import modalsReducer from './rtk/slices/modals.slice';
import searchInputReducer from './rtk/slices/searchInput.slice';
import userReducer from './rtk/slices/user.slice';
import { tvReducer } from './tv/reducers';

export type AppState = {
  user: ReturnType<typeof userReducer>;
  tv: ReturnType<typeof tvReducer>;
  searchInput: ReturnType<typeof searchInputReducer>;
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
