import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  shouldResetSearchInput: boolean;
};

const initialState: State = {
  /* Used to trigger handleClearInput in SearchPage when navigating home */
  shouldResetSearchInput: false,
};

const searchInputSlice = createSlice({
  name: 'searchInput',
  initialState,
  reducers: {
    setShouldResetSearchInput: (state, action: PayloadAction<boolean>) => {
      state.shouldResetSearchInput = action.payload;
    },
  },
  selectors: {
    selectShouldResetSearchInput: state => state.shouldResetSearchInput,
  },
});

export const { setShouldResetSearchInput } = searchInputSlice.actions;

export const { selectShouldResetSearchInput } = searchInputSlice.selectors;

export const searchInputReducer = searchInputSlice.reducer;
