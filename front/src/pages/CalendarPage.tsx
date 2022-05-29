import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
import FullCalendar, { EventClickArg, EventContentArg, FormatterInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { selectFollowedShows } from 'store/user/selectors';
import { getEpisodesForCalendarAction } from 'store/tv/actions';
import { selectCalendarEpisodesForDisplay } from 'store/tv/selectors';
import { ROUTES } from 'constants/routes';
import NoFollowedShowsBanner from 'components/calendar/NoFollowedShowsBanner';
import theme from 'theme';

const darkModeCalendarCss = css`
  /* day of the week headers, "more" popover, mobile day of the week headers */
  .fc-col-header-cell,
  .fc-more-popover,
  .fc-list-day-cushion {
    background-color: ${theme.colors.darkBlack} !important;
  }
  /* event hover color on mobile */
  .fc .fc-list-event:hover td {
    background-color: ${theme.colors.black} !important;
  }
`;

const CalendarPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const followedShows = useSelector(selectFollowedShows);
  const calendarEpisodes = useSelector(selectCalendarEpisodesForDisplay);
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const loadEpisodes = () =>
      document.visibilityState === 'visible' && dispatch(getEpisodesForCalendarAction());
    // Load episodes on first render and when browser tab gets re-focused
    loadEpisodes();
    window.addEventListener('visibilitychange', loadEpisodes);
    return () => window.removeEventListener('visibilitychange', loadEpisodes);
  }, [dispatch, followedShows]);

  const onEventClick = (eventInfo: EventClickArg) => {
    const showId = eventInfo.event._def.extendedProps.showId;
    history.push(`${ROUTES.SHOW}/${showId}`);
  };

  const addPopoverToEvent = (eventInfo: EventContentArg) => (
    <Popover placement="top" trigger="hover">
      {/* @ts-ignore - React 18 issue. Check after upgrading to chakra version 2 */}
      <PopoverTrigger>
        <Text mx="6px" textAlign={isMobile ? 'left' : 'center'} isTruncated>
          {eventInfo.event.title}
        </Text>
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

  const formatMobileEvent = (eventInfo: EventContentArg) => (
    <Text color="white" cursor="pointer">
      {eventInfo.event.title}
    </Text>
  );

  const titleFormat: FormatterInput = {
    month: isMobile ? 'short' : 'long',
    year: 'numeric',
  };

  return (
    <>
      <Helmet title="Calendar | TV Minder" />
      {!followedShows.length && <NoFollowedShowsBanner />}
      <Box
        m="15px auto 0"
        maxW="1180px"
        p={{ base: '0 15px 20px', md: '0 25px 20px' }}
        w={{ base: '90%', md: '98%' }}
      >
        <Global styles={colorMode === 'dark' && darkModeCalendarCss} />
        <FullCalendar
          allDayContent={false}
          dayMaxEventRows={5}
          eventAllow={() => false} // do not allow dragging
          eventClick={onEventClick}
          eventContent={isMobile ? formatMobileEvent : addPopoverToEvent}
          events={calendarEpisodes}
          fixedWeekCount={false} // don't force showing additional weeks in calendar view
          height={isMobile ? 'auto' : '84vh'}
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
