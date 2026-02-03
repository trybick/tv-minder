import { createContext, useContext } from 'react';

export type CarouselSize = 'md' | 'sm';

type CarouselContextValue = {
  size: CarouselSize;
};

const defaultValue: CarouselContextValue = { size: 'md' };

const CarouselContext = createContext<CarouselContextValue>(defaultValue);

export const CarouselProvider = CarouselContext.Provider;

export const useCarouselContext = () => useContext(CarouselContext);
