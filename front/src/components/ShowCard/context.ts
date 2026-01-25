import { createContext, useContext } from 'react';

import { type ShowItem } from './helpers';

const ShowCardContext = createContext<ShowItem | null>(null);

export const ShowCardProvider = ShowCardContext.Provider;

export const useShowCardContext = () => {
  const context = useContext(ShowCardContext);
  if (!context) {
    throw new Error('ShowCard components must be used within ShowCard.Root');
  }
  return context;
};
