import {
  Box,
  Button,
  Flex,
  Group,
  Heading,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import type FullCalendar from '@fullcalendar/react';
import { type RefObject } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

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
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="semibold"
        letterSpacing="tight"
        color="fg"
        justifySelf="start"
        ml="0.5"
        display="flex"
        alignItems="center"
        gap={2}
      >
        {title}
        {isMobile && isLoading && <Spinner size="sm" color="cyan.400" />}
      </Heading>

      <Box h="36px" display="flex" alignItems="center" justifyContent="center">
        {!isMobile && (
          <LoadingEpisodesBanner
            isLoading={isLoading}
            hasNoEpisodesThisMonth={!hasEpisodesInCurrentMonth}
          />
        )}
      </Box>

      <Flex align="center" gap={2} justifySelf="end">
        <Button
          size="sm"
          h="36px"
          px={3.5}
          variant="outline"
          rounded="lg"
          color="fg.muted"
          borderColor="whiteAlpha.200"
          fontWeight="medium"
          onClick={handleToday}
          _hover={{
            bg: 'whiteAlpha.100',
            borderColor: 'whiteAlpha.300',
            color: 'fg',
          }}
        >
          today
        </Button>

        <Group attached>
          <IconButton
            aria-label="Previous month"
            size="sm"
            h="36px"
            variant="outline"
            rounded="lg"
            color="fg.muted"
            borderColor="whiteAlpha.200"
            onClick={handlePrev}
            _hover={{ bg: 'whiteAlpha.100', color: 'fg' }}
          >
            <LuChevronLeft />
          </IconButton>
          <IconButton
            aria-label="Next month"
            size="sm"
            h="36px"
            variant="outline"
            rounded="lg"
            color="fg.muted"
            borderColor="whiteAlpha.200"
            onClick={handleNext}
            _hover={{ bg: 'whiteAlpha.100', color: 'fg' }}
          >
            <LuChevronRight />
          </IconButton>
        </Group>
      </Flex>
    </Box>
  );
};
