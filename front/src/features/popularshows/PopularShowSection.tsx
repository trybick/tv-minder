import { Carousel, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

import { type ShowItem } from '~/components/ShowCard';

import { PopularShowCard } from './PopularShowCard';

const slidesPerPageByBreakpoint = {
  base: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
} as const;

type Props = {
  shows: ShowItem[];
};

export const PopularShowSection = ({ shows }: Props) => {
  const slidesPerPage =
    useBreakpointValue(slidesPerPageByBreakpoint, { ssr: false }) ??
    slidesPerPageByBreakpoint.base;

  if (shows.length === 0) return null;

  return (
    <Carousel.Root
      slideCount={shows.length}
      slidesPerPage={slidesPerPage}
      slidesPerMove={slidesPerPage}
      gap="5"
      allowMouseDrag
    >
      <Carousel.Control position="relative" width="full">
        <Carousel.PrevTrigger asChild>
          <IconButton
            aria-label="Previous"
            size="2xl"
            variant="plain"
            color="white"
            position="absolute"
            left="-12"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            opacity={0.8}
            _hover={{ opacity: 1 }}
            _disabled={{ opacity: 0.2, cursor: 'not-allowed' }}
          >
            <HiChevronLeft size={48} />
          </IconButton>
        </Carousel.PrevTrigger>

        <Carousel.ItemGroup width="full">
          {shows.map((show, index) => (
            <Carousel.Item key={show.id} index={index}>
              <PopularShowCard show={show} />
            </Carousel.Item>
          ))}
        </Carousel.ItemGroup>

        <Carousel.NextTrigger asChild>
          <IconButton
            aria-label="Next"
            size="2xl"
            variant="plain"
            color="white"
            position="absolute"
            right="-12"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            opacity={0.8}
            _hover={{ opacity: 1 }}
            _disabled={{ opacity: 0.2, cursor: 'not-allowed' }}
          >
            <HiChevronRight size={48} />
          </IconButton>
        </Carousel.NextTrigger>
      </Carousel.Control>

      <Carousel.Indicators mt={4} />
    </Carousel.Root>
  );
};
