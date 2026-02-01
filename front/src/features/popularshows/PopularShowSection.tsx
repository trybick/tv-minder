import { Carousel, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

import { showElementsByBreakpoint, type ShowItem } from '~/components/ShowCard';

import { PopularShowCard } from './PopularShowCard';

type Props = {
  shows: ShowItem[];
};

export const PopularShowSection = ({ shows }: Props) => {
  const slidesPerPage =
    useBreakpointValue(showElementsByBreakpoint, { ssr: false }) ??
    showElementsByBreakpoint.base;

  if (shows.length === 0) {
    return null;
  }

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
            variant="plain"
            color="white"
            position="absolute"
            left="-16"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            opacity={0.7}
            w="16"
            h="16"
            _hover={{ opacity: 1 }}
            _disabled={{ opacity: 0.2, cursor: 'not-allowed' }}
          >
            <HiChevronLeft style={{ width: '45px', height: '45px' }} />
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
            variant="plain"
            color="white"
            position="absolute"
            right="-16"
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            opacity={0.7}
            w="16"
            h="16"
            _hover={{ opacity: 1 }}
            _disabled={{ opacity: 0.2, cursor: 'not-allowed' }}
          >
            <HiChevronRight style={{ width: '45px', height: '45px' }} />
          </IconButton>
        </Carousel.NextTrigger>
      </Carousel.Control>

      <Carousel.Indicators mt={4} />
    </Carousel.Root>
  );
};
