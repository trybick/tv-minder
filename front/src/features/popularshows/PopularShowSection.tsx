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
      <Carousel.ItemGroup>
        {shows.map((show, index) => (
          <Carousel.Item key={show.id} index={index}>
            <PopularShowCard show={show} />
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
