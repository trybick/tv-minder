import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalsState = {
  login: boolean;
  signUp: boolean;
  feedback: boolean;
};

const initialState: ModalsState = {
  login: false,
  signUp: false,
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
      state.signUp = action.payload;
    },
    setIsFeedbackModalOpen: (state, action: PayloadAction<boolean>) => {
      state.feedback = action.payload;
    },
  },
  selectors: {
    selectIsLoginModalOpen: state => state.login,
    selectIsSignUpModalOpen: state => state.signUp,
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

export default modalsSlice.reducer;
