import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import {
  Selector,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import searchInputReducer from '~/components/search/searchInputSlice';

import { persistedReducer } from './rootReducer';
import { tvReducer } from './tv/reducers';
import { userReducer } from './user/reducers';

export type AppState = {
  user: ReturnType<typeof userReducer>;
  tv: ReturnType<typeof tvReducer>;
  searchInput: ReturnType<typeof searchInputReducer>;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
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
