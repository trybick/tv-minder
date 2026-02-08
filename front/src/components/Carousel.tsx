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

  const buttonSize =
    size === 'sm'
      ? { base: 'lg' as const, md: 'xl' as const }
      : { base: 'xl' as const, md: '2xl' as const };
  const iconSize = size === 'sm' ? 16 : 24;

  if (!items?.length) {
    return (
      <CarouselProvider value={contextValue}>
        <ChakraCarousel.Root
          slideCount={slidesPerPage}
          slidesPerPage={slidesPerPage}
          slidesPerMove={slidesPerPage}
          gap="5"
          allowMouseDrag
          position="relative"
          overflow="visible"
        >
          <ChakraCarousel.ItemGroup overflow="hidden">
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
                    <Skeleton h="11" />
                    <Skeleton h="11" />
                  </Flex>
                </Flex>
              </ChakraCarousel.Item>
            ))}
          </ChakraCarousel.ItemGroup>
          <ChakraCarousel.Indicators mt={2} />
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
        position="relative"
        overflow="visible"
      >
        <ChakraCarousel.ItemGroup overflow="hidden">
          {items.map((item, index) => (
            <ChakraCarousel.Item key={keyExtractor(item)} index={index}>
              {renderItem(item)}
            </ChakraCarousel.Item>
          ))}
        </ChakraCarousel.ItemGroup>

        <ChakraCarousel.PrevTrigger asChild>
          <IconButton
            aria-label="Previous"
            position="absolute"
            left={0}
            top="50%"
            transform="translate(-50%, -50%)"
            zIndex={1}
            size={buttonSize}
            borderRadius="full"
            bg="blackAlpha.700"
            color="white"
            boxShadow="md"
            _hover={{ bg: 'blackAlpha.800' }}
            _active={{ bg: 'blackAlpha.900' }}
          >
            <HiChevronLeft size={iconSize} />
          </IconButton>
        </ChakraCarousel.PrevTrigger>

        <ChakraCarousel.NextTrigger asChild>
          <IconButton
            aria-label="Next"
            position="absolute"
            right={0}
            top="50%"
            transform="translate(50%, -50%)"
            zIndex={1}
            size={buttonSize}
            borderRadius="full"
            bg="blackAlpha.700"
            color="white"
            boxShadow="md"
            _hover={{ bg: 'blackAlpha.800' }}
            _active={{ bg: 'blackAlpha.900' }}
          >
            <HiChevronRight size={iconSize} />
          </IconButton>
        </ChakraCarousel.NextTrigger>

        <ChakraCarousel.Indicators mt={2} />
      </ChakraCarousel.Root>
    </CarouselProvider>
  );
};
