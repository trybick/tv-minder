import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = {
  login: boolean;
  signup: boolean;
  feedback: boolean;
};

const initialState: State = {
  login: false,
  signup: false,
  feedback: false,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setIsLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.login = action.payload;
    },
    setIsSignUpModalOpen: (state, action: PayloadAction<boolean>) => {
      state.signup = action.payload;
    },
    setIsFeedbackModalOpen: (state, action: PayloadAction<boolean>) => {
      state.feedback = action.payload;
    },
  },
  selectors: {
    selectIsLoginModalOpen: state => state.login,
    selectIsSignUpModalOpen: state => state.signup,
    selectIsFeedbackModalOpen: state => state.feedback,
  },
});

export const {
  setIsLoginModalOpen,
  setIsSignUpModalOpen,
  setIsFeedbackModalOpen,
} = modalsSlice.actions;

export const {
  selectIsLoginModalOpen,
  selectIsSignUpModalOpen,
  selectIsFeedbackModalOpen,
} = modalsSlice.selectors;

export const modalsReducer = modalsSlice.reducer;
