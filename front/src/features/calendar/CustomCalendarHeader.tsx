import { Box, Button, Flex, Text } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import moment from 'moment';
import { RefObject, useMemo } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCalendarEpisodesForDisplay,
  selectIsLoadingCalendarEpisodes,
} from '~/store/legacy/tv/selectors';
import { userApi } from '~/store/rtk/api/user.api';

import NoFollowedShowsBanner from './NoFollowedShowsBanner';

type Props = {
  calendarRef: RefObject<FullCalendar | null>;
  title: string;
  viewRange: { start: Date; end: Date } | null;
};

const CustomCalendarHeader = ({ calendarRef, title, viewRange }: Props) => {
  const isMobile = useIsMobile();

  const calendarEpisodes = useAppSelector(selectCalendarEpisodesForDisplay);
  const isLoadingCalendarEpisodes = useAppSelector(
    selectIsLoadingCalendarEpisodes
  );
  const { isLoading: isLoadingFollowedShows } = useAppSelector(
    userApi.endpoints.getFollowedShows.select(undefined)
  );

  const hasEpisodesInCurrentMonth = useMemo(() => {
    if (!viewRange || isLoadingCalendarEpisodes || isLoadingFollowedShows) {
      return true;
    }

    return calendarEpisodes.some(episode => {
      return moment(episode.date).isBetween(
        moment(viewRange.start),
        moment(viewRange.end),
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
      <Text fontSize="3xl" justifySelf="start">
        {title}
      </Text>

      <Box>
        {!isMobile && !hasEpisodesInCurrentMonth && <NoFollowedShowsBanner />}
      </Box>

      <Flex align="center" gap={2} justifySelf="end">
        <Button size="sm" variant="subtle" onClick={handleToday}>
          today
        </Button>
        <Button size="sm" variant="subtle" onClick={handlePrev}>
          <LuChevronLeft />
        </Button>
        <Button size="sm" variant="subtle" onClick={handleNext}>
          <LuChevronRight />
        </Button>
      </Flex>
    </Box>
  );
};

export default CustomCalendarHeader;
