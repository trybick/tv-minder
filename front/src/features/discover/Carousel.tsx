import {
  Carousel as ChakraCarousel,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

import { showElementsByBreakpoint } from '~/components/ShowCard';

type Props<T> = {
  items: T[];
  keyExtractor: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
};

export const Carousel = <T,>({ items, keyExtractor, renderItem }: Props<T>) => {
  const slidesPerPage =
    useBreakpointValue(showElementsByBreakpoint, { ssr: false }) ??
    showElementsByBreakpoint.base;

  if (items.length === 0) {
    return null;
  }

  return (
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
  );
};
