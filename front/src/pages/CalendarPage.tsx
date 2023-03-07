import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Text, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { css, Global } from '@emotion/react';
import FullCalendar, { EventClickArg, EventContentArg, FormatterInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useIsMobile } from 'hooks/useIsMobile';
import { selectFollowedShows } from 'store/user/selectors';
import { getEpisodesForCalendarAction } from 'store/tv/actions';
import { selectCalendarEpisodesForDisplay } from 'store/tv/selectors';
import { ROUTES } from 'constants/routes';
import theme from 'theme';
import NoFollowedShowsBanner from 'components/calendar/NoFollowedShowsBanner';
import CalendarEventPopover from 'components/calendar/CalendarEventPopover';

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

const eventStyles = css`
  /* Add vertical space between calendar events */
  .fc-daygrid-event-harness {
    margin-bottom: 6px;
  }
`;

const eventPopoverStyles = css`
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
  const isMobile = useIsMobile();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === 'dark';
  const mobileEventColor = useColorModeValue('black', 'white');

  useEffect(() => {
    const loadEpisodes = () => {
      if (document.visibilityState === 'visible') {
        dispatch(getEpisodesForCalendarAction());
      }
    };
    loadEpisodes();
    window.addEventListener('visibilitychange', loadEpisodes);
    return () => window.removeEventListener('visibilitychange', loadEpisodes);
  }, [dispatch, followedShows]);

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

  const formatDesktopEvent = (eventInfo: EventClickArg & { backgroundColor: string }) => {
    const { backgroundColor } = eventInfo;
    const { title } = eventInfo.event;
    const { episodeName, network, overview, runtime, seasonAndEpisodeNumers, showId, showName } =
      eventInfo.event._def.extendedProps;

    return (
      <CalendarEventPopover
        backgroundColor={backgroundColor}
        episodeName={episodeName}
        network={network}
        overview={overview}
        runtime={runtime}
        seasonAndEpisodeNumers={seasonAndEpisodeNumers}
        showId={showId}
        showName={showName}
        title={title}
      />
    );
  };

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
        p={{ base: '0 15px 20px', md: '10px 25px 20px' }}
        w={{ base: '90%', md: '99%', xl: '90%' }}
      >
        <Global styles={[eventStyles, eventPopoverStyles, isDarkMode && darkModeCalendarStyling]} />
        <FullCalendar
          allDayContent={false}
          dayMaxEventRows={5}
          eventAllow={() => false} // do not allow dragging
          eventClick={onEventClick}
          eventContent={isMobile ? formatMobileEvent : formatDesktopEvent}
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
