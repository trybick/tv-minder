import { Box, Button, Flex, Heading, Spinner } from '@chakra-ui/react';
import type FullCalendar from '@fullcalendar/react';
import { type RefObject } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { MdOutlineResetTv } from 'react-icons/md';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import { selectCalendarEpisodesForDisplay } from '~/store/tv/selectors';
import { trackEvent } from '~/utils/analytics';
import { dayjs } from '~/utils/dayjs';

import { LoadingEpisodesBanner } from './LoadingEpisodesBanner';

type Props = {
  calendarRef: RefObject<FullCalendar | null>;
  isLoading: boolean;
  title: string;
  viewRange: { start: Date; end: Date } | null;
};

export const CalendarHeader = ({
  calendarRef,
  isLoading,
  title,
  viewRange,
}: Props) => {
  const { isMobile } = useResponsiveLayout();

  const calendarEpisodes = useAppSelector(selectCalendarEpisodesForDisplay);

  const hasEpisodesInCurrentMonth =
    !viewRange || isLoading
      ? true
      : calendarEpisodes.some(episode =>
          dayjs(episode.date).isBetween(
            dayjs(viewRange.start),
            dayjs(viewRange.end),
            'day',
            '[]'
          )
        );

  const handlePrev = () => {
    trackEvent({ category: 'Calendar', action: 'Previous Month Clicked' });
    calendarRef.current?.getApi().prev();
  };

  const handleNext = () => {
    trackEvent({ category: 'Calendar', action: 'Next Month Clicked' });
    calendarRef.current?.getApi().next();
  };

  const handleToday = () => {
    trackEvent({ category: 'Calendar', action: 'Today Clicked' });
    calendarRef.current?.getApi().today();
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr auto 1fr"
      alignItems="center"
      mb={4}
      gap={3}
    >
      <Heading
        fontSize="2xl"
        fontWeight="semibold"
        justifySelf="start"
        ml="0.5"
        display="flex"
        alignItems="center"
        gap={2}
      >
        {title}
        {isMobile && isLoading && <Spinner size="sm" />}
      </Heading>

      <Box>
        {!isMobile && (
          <LoadingEpisodesBanner
            isLoading={isLoading}
            hasNoEpisodesThisMonth={!hasEpisodesInCurrentMonth}
          />
        )}
      </Box>

      <Flex align="center" gap={5} justifySelf="end">
        <Button
          size="sm"
          h="42px"
          variant="surface"
          colorPalette="cyan"
          onClick={handleToday}
          opacity={0.8}
        >
          <MdOutlineResetTv opacity={0.8} />
          today
        </Button>

        <Flex gap={2}>
          <Button
            size="sm"
            h="42px"
            variant="surface"
            colorPalette="cyan"
            onClick={handlePrev}
          >
            <LuChevronLeft opacity={0.8} />
          </Button>
          <Button
            size="sm"
            h="42px"
            variant="surface"
            colorPalette="cyan"
            onClick={handleNext}
          >
            <LuChevronRight opacity={0.8} />
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
