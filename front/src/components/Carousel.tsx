import {
  Carousel as ChakraCarousel,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { type ReactNode, useMemo } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

import { showElementsByBreakpoint } from './ShowCard';
import { CarouselProvider, type CarouselSize } from './carouselContext';

type Props<T> = {
  items: T[];
  keyExtractor: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  size?: CarouselSize;
};

const smallSlidesPerPage = {
  base: 2,
  md: 3,
  lg: 4,
  xl: 4,
  '2xl': 4,
};

export const Carousel = <T,>({
  items,
  keyExtractor,
  renderItem,
  size = 'md',
}: Props<T>) => {
  const slidesConfig =
    size === 'sm' ? smallSlidesPerPage : showElementsByBreakpoint;
  const slidesPerPage =
    useBreakpointValue(slidesConfig, { ssr: false }) ?? slidesConfig.base;
  const contextValue = useMemo(() => ({ size }), [size]);

  if (items.length === 0) {
    return null;
  }

  return (
    <CarouselProvider value={contextValue}>
      <ChakraCarousel.Root
        slideCount={items.length}
        slidesPerPage={slidesPerPage}
        slidesPerMove={slidesPerPage}
        gap="5"
        allowMouseDrag
      >
        <ChakraCarousel.ItemGroup>
          {items.map((item, index) => (
            <ChakraCarousel.Item key={keyExtractor(item)} index={index}>
              {renderItem(item)}
            </ChakraCarousel.Item>
          ))}
        </ChakraCarousel.ItemGroup>

        <ChakraCarousel.Control justifyContent="center" gap="4" mt={4}>
          <ChakraCarousel.PrevTrigger asChild>
            <IconButton
              aria-label="Previous"
              size="sm"
              variant="ghost"
              colorPalette="cyan"
            >
              <HiChevronLeft />
            </IconButton>
          </ChakraCarousel.PrevTrigger>

          <ChakraCarousel.Indicators />

          <ChakraCarousel.NextTrigger asChild>
            <IconButton
              aria-label="Next"
              size="sm"
              variant="ghost"
              colorPalette="cyan"
            >
              <HiChevronRight />
            </IconButton>
          </ChakraCarousel.NextTrigger>
        </ChakraCarousel.Control>
      </ChakraCarousel.Root>
    </CarouselProvider>
  );
};
