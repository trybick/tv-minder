import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  shouldResetSearchInput: boolean;
};

const initialState: State = {
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

export default searchInputSlice.reducer;
