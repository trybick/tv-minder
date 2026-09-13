import { createContext, useContext } from 'react';

export const AuthDialogClosingContext = createContext(false);

export const useIsAuthDialogClosing = () => {
  return useContext(AuthDialogClosingContext);
};
