import { type ButtonProps } from '@chakra-ui/react';
import { createContext, useContext } from 'react';

import { type ShowItem } from './helpers';

type ShowCardContextValue = {
  show: ShowItem;
  followButtonSize?: ButtonProps['size'];
};

const ShowCardContext = createContext<ShowCardContextValue | null>(null);

export const ShowCardProvider = ShowCardContext.Provider;

export const useShowCardContext = () => {
  const context = useContext(ShowCardContext);
  if (!context) {
    throw new Error('ShowCard components must be used within ShowCard.Root');
  }
  return context;
};
