import { Carousel, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

import { showElementsByBreakpoint } from '~/components/ShowCard';

type Props<T> = {
  items: T[];
  keyExtractor: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
};

export const ShowCarousel = <T,>({
  items,
  keyExtractor,
  renderItem,
}: Props<T>) => {
  const slidesPerPage =
    useBreakpointValue(showElementsByBreakpoint, { ssr: false }) ??
    showElementsByBreakpoint.base;

  if (items.length === 0) {
    return null;
  }

  return (
    <Carousel.Root
      slideCount={items.length}
      slidesPerPage={slidesPerPage}
      slidesPerMove={slidesPerPage}
      gap="5"
      allowMouseDrag
    >
      <Carousel.ItemGroup>
        {items.map((item, index) => (
          <Carousel.Item key={keyExtractor(item)} index={index}>
            {renderItem(item)}
          </Carousel.Item>
        ))}
      </Carousel.ItemGroup>

      <Carousel.Control justifyContent="center" gap="4" mt={4}>
        <Carousel.PrevTrigger asChild>
          <IconButton
            aria-label="Previous"
            size="sm"
            variant="ghost"
            colorPalette="cyan"
          >
            <HiChevronLeft />
          </IconButton>
        </Carousel.PrevTrigger>

        <Carousel.Indicators />

        <Carousel.NextTrigger asChild>
          <IconButton
            aria-label="Next"
            size="sm"
            variant="ghost"
            colorPalette="cyan"
          >
            <HiChevronRight />
          </IconButton>
        </Carousel.NextTrigger>
      </Carousel.Control>
    </Carousel.Root>
  );
};
