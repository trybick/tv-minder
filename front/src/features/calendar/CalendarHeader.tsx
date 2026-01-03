import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import { RefObject, useMemo } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { MdOutlineResetTv } from 'react-icons/md';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { followApi } from '~/store/rtk/api/follow.api';
import {
  selectCalendarEpisodesForDisplay,
  selectIsLoadingCalendarEpisodes,
} from '~/store/tv/selectors';
import dayjs from '~/utils/dayjs';

import LoadingEpisodesBanner from './LoadingEpisodesBanner';

type Props = {
  calendarRef: RefObject<FullCalendar | null>;
  title: string;
  viewRange: { start: Date; end: Date } | null;
};

const CalendarHeader = ({ calendarRef, title, viewRange }: Props) => {
  const isMobile = useIsMobile();

  const calendarEpisodes = useAppSelector(selectCalendarEpisodesForDisplay);
  const isLoadingCalendarEpisodes = useAppSelector(
    selectIsLoadingCalendarEpisodes
  );
  const { isLoading: isLoadingFollowedShows } = useAppSelector(
    followApi.endpoints.getFollowedShows.select(undefined)
  );

  const hasEpisodesInCurrentMonth = useMemo(() => {
    if (!viewRange || isLoadingCalendarEpisodes || isLoadingFollowedShows) {
      return true;
    }

    return calendarEpisodes.some(episode => {
      return dayjs(episode.date).isBetween(
        dayjs(viewRange.start),
        dayjs(viewRange.end),
        'day',
        '[]'
      );
    });
  }, [
    calendarEpisodes,
    isLoadingCalendarEpisodes,
    isLoadingFollowedShows,
    viewRange,
  ]);

  const handlePrev = () => calendarRef.current?.getApi().prev();
  const handleNext = () => calendarRef.current?.getApi().next();
  const handleToday = () => calendarRef.current?.getApi().today();

  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr auto 1fr"
      alignItems="center"
      mb={4}
      gap={3}
    >
      <Heading
        fontSize="3xl"
        fontWeight="semibold"
        justifySelf="start"
        ml="2px"
      >
        {title}
      </Heading>

      <Box>
        {!isMobile && (
          <LoadingEpisodesBanner
            isLoading={isLoadingCalendarEpisodes || isLoadingFollowedShows}
            hasNoEpisodesThisMonth={!hasEpisodesInCurrentMonth}
          />
        )}
      </Box>

      <Flex align="center" gap={2} justifySelf="end">
        <Button size="sm" h="42px" variant="subtle" onClick={handleToday}>
          <MdOutlineResetTv />
          today
        </Button>
        <Button size="sm" h="42px" variant="subtle" onClick={handlePrev}>
          <LuChevronLeft />
        </Button>
        <Button size="sm" h="42px" variant="subtle" onClick={handleNext}>
          <LuChevronRight />
        </Button>
      </Flex>
    </Box>
  );
};

export default CalendarHeader;
