import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import { RefObject, useMemo } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { userApi } from '~/store/rtk/api/user.api';
import {
  selectCalendarEpisodesForDisplay,
  selectIsLoadingCalendarEpisodes,
} from '~/store/tv/selectors';
import dayjs from '~/utils/dayjs';

import NoFollowedShowsBanner from './NoFollowedShowsBanner';
import UpdatingCalendarBanner from './UpdatingCalendarBanner';

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
        fontSize="4xl"
        fontWeight="semibold"
        color="fg.muted"
        justifySelf="start"
        ml="2px"
      >
        {title}
      </Heading>

      <Box>
        {!isMobile &&
          (isLoadingCalendarEpisodes || isLoadingFollowedShows ? (
            <UpdatingCalendarBanner />
          ) : (
            !hasEpisodesInCurrentMonth && <NoFollowedShowsBanner />
          ))}
      </Box>

      <Flex align="center" gap={2} justifySelf="end">
        <Button size="sm" h="42px" variant="subtle" onClick={handleToday}>
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

export default CustomCalendarHeader;
