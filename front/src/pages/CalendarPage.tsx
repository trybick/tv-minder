import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import { css, Global } from '@emotion/react';
import FullCalendar, { EventContentArg, FormatterInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { selectFollowedShows } from 'store/user/selectors';
import { getEpisodesForCalendarAction } from 'store/tv/actions';
import { selectCalendarEpisodesForDisplay } from 'store/tv/selectors';
import NoFollowedShowsBanner from 'components/calendar/NoFollowedShowsBanner';
import theme from 'theme';

const darkModeCalendarCss = css`
.fc-col-header-cell,
.fc-more-popover,
.fc-list-day-cushion {
  background-color: ${theme.colors.darkBlack} !important;`;

const CalendarPage = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const calendarEpisodes = useSelector(selectCalendarEpisodesForDisplay);
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  const { colorMode } = useColorMode();

  useEffect(() => {
    dispatch(getEpisodesForCalendarAction());
  }, [dispatch, followedShows]);

  const addPopoverToEvent = (eventInfo: EventContentArg) => (
    <Popover placement="top" trigger="hover">
      <PopoverTrigger>
        <Text overflow="hidden">{eventInfo.event.title}</Text>
      </PopoverTrigger>
      <Portal>
        <PopoverContent bg={eventInfo.backgroundColor} w="unset" zIndex={4}>
          <PopoverArrow bg={eventInfo.backgroundColor} />
          <PopoverBody>
            <Text color="white" fontSize="sm">
              {eventInfo.event.title}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );

  const titleFormat: FormatterInput = {
    month: isMobile ? 'short' : 'long',
    year: 'numeric',
  };

  return (
    <>
      {!followedShows.length && <NoFollowedShowsBanner />}
      <Box
        m="15px auto 0"
        maxW="1170px"
        p={{ base: '0 15px 20px', md: '0 25px 20px' }}
        w={{ base: '90%', md: 'unset' }}
      >
        <Global styles={colorMode === 'dark' && darkModeCalendarCss} />
        <FullCalendar
          allDayContent={false}
          dayMaxEventRows={5}
          eventAllow={() => false} // do not allow dragging
          eventContent={addPopoverToEvent}
          events={calendarEpisodes}
          height="auto"
          initialView={isMobile ? 'listMonth' : 'dayGridMonth'}
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          titleFormat={titleFormat}
          editable // enable mouse pointer cursor
        />
      </Box>
    </>
  );
};

export default CalendarPage;
