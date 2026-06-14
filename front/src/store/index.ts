import {
  type Action,
  configureStore,
  type Selector,
  type ThunkAction,
} from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import { persistStore } from 'redux-persist';

import { persistedReducer, type rootReducer } from './rootReducer';
import { baseApi } from './rtk/api/baseApi';
import { errorHandlerMiddleware } from './rtk/api/errorHandlerMiddleware';

export type RootState = ReturnType<typeof rootReducer>;

export type AppSelector<T> = Selector<RootState, T>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

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

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type AppDispatch = typeof store.dispatch;
