import {
  Carousel as ChakraCarousel,
  Flex,
  IconButton,
  Skeleton,
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

  if (!items?.length) {
    return (
      <CarouselProvider value={contextValue}>
        <ChakraCarousel.Root
          slideCount={slidesPerPage}
          slidesPerPage={slidesPerPage}
          gap="5"
        >
          <ChakraCarousel.ItemGroup>
            {Array.from({ length: slidesPerPage }).map((_, index) => (
              <ChakraCarousel.Item key={index} index={index}>
                <Flex
                  direction="column"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  overflow="hidden"
                  bg="whiteAlpha.50"
                >
                  <Skeleton aspectRatio={2 / 3} />
                  <Flex
                    direction="column"
                    p={{ base: '2.5', md: '3' }}
                    gap="2.5"
                  >
                    <Skeleton h="5" />
                    <Skeleton h="8" />
                  </Flex>
                </Flex>
              </ChakraCarousel.Item>
            ))}
          </ChakraCarousel.ItemGroup>
        </ChakraCarousel.Root>
      </CarouselProvider>
    );
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
