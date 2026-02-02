import {
  Carousel as ChakraCarousel,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { Children, type ReactNode } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

import { showElementsByBreakpoint } from '~/components/ShowCard';

type Props = {
  children: ReactNode;
};

export const Carousel = ({ children }: Props) => {
  const slidesPerPage =
    useBreakpointValue(showElementsByBreakpoint, { ssr: false }) ??
    showElementsByBreakpoint.base;

  const childArray = Children.toArray(children);

  if (childArray.length === 0) {
    return null;
  }

  return (
    <ChakraCarousel.Root
      slideCount={childArray.length}
      slidesPerPage={slidesPerPage}
      slidesPerMove={slidesPerPage}
      gap="5"
      allowMouseDrag
    >
      <ChakraCarousel.ItemGroup>
        {childArray.map((child, index) => (
          <ChakraCarousel.Item key={index} index={index}>
            {child}
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
