import { useEffect, useRef } from 'react';
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
  useColorModeValue,
  useMediaQuery,
} from '@chakra-ui/react';
import { css, Global } from '@emotion/react';
import moment from 'moment';
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

const darkModeCalendarStyling = css`
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

const eventPopoverStyling = css`
  /* without this, 'display: -webkit-box' gets added which breaks the truncation  */
  .calendarEventPopoverTrigger {
    display: block !important;
  }
`;

const CalendarPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const followedShows = useSelector(selectFollowedShows);
  const calendarEpisodes = useSelector(selectCalendarEpisodesForDisplay);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';
  const mobileEventColor = useColorModeValue('black', 'white');

  // Load episodes on first render and when browser tab gets re-focused
  useEffect(() => {
    const loadEpisodes = () => {
      if (document.visibilityState === 'visible') {
        console.log(moment().format('hh:mm:ss dddd'), 'loading episodes:');
        dispatch(getEpisodesForCalendarAction());
      }
    };
    loadEpisodes();
    window.addEventListener('visibilitychange', loadEpisodes);
    return () => window.removeEventListener('visibilitychange', loadEpisodes);
  }, [dispatch, followedShows]);

  // Change calendar view type based on viewport
  useEffect(() => {
    const changeView = (view: string) => calendarRef.current?.getApi().changeView(view);
    if (isMobile) {
      changeView('listMonth');
    } else {
      changeView('dayGridMonth');
    }
  }, [isMobile]);

  const onEventClick = (eventInfo: EventClickArg) => {
    const showId = eventInfo.event._def.extendedProps.showId;
    history.push(`${ROUTES.SHOW}/${showId}`);
  };

  const addPopoverToEvent = (eventInfo: EventContentArg) => (
    <Popover placement="top" trigger="hover">
      <PopoverTrigger>
        <Text
          className="calendarEventPopoverTrigger"
          mx="6px"
          noOfLines={1}
          textAlign={isMobile ? 'left' : 'center'}
        >
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
    <Text color={mobileEventColor} cursor="pointer">
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
        p={{ base: '0 15px 20px', md: '0 25px 20px' }}
        w={{ base: '90%', md: '99%', xl: '90%' }}
      >
        <Global styles={[eventPopoverStyling, isDarkMode && darkModeCalendarStyling]} />
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
          ref={calendarRef}
          titleFormat={titleFormat}
          editable // enable mouse pointer cursor
        />
      </Box>
    </>
  );
};

export default CalendarPage;
