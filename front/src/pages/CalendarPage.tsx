import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'wouter';
import moment from 'moment';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { TbBoxMultiple } from 'react-icons/tb';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useIsMobile } from 'hooks/useIsMobile';
import { useAppDispatch } from 'store';
import { selectFollowedShows } from 'store/user/selectors';
import { getEpisodesForCalendarAction } from 'store/tv/actions';
import { selectCalendarEpisodesForDisplay } from 'store/tv/selectors';
import { ROUTES } from 'constants/routes';
import NoFollowedShowsBanner from 'components/calendar/NoFollowedShowsBanner';
import DesktopCalendarEventPopover from 'components/calendar/DesktopCalendarEventPopover';

const CalendarPage = () => {
  const dispatch = useAppDispatch();
  const [, navigate] = useLocation();

  const followedShows = useSelector(selectFollowedShows);
  const calendarEpisodes = useSelector(selectCalendarEpisodesForDisplay);
  const calendarRef = useRef<FullCalendar | null>(null);
  const isMobile = useIsMobile();

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
    const showId = eventInfo.event.extendedProps.showId;
    navigate(`${ROUTES.SHOW}/${showId}`);
  };

  const formatDesktopEvent = (eventInfo: EventContentArg & { backgroundColor: string }) => (
    <DesktopCalendarEventPopover eventInfo={eventInfo} />
  );

  const formatMobileEvent = (eventInfo: EventContentArg) => {
    const { title } = eventInfo.event;
    const { isMulipleEvent } = eventInfo.event.extendedProps;
    return (
      <Flex>
        {isMulipleEvent && <Icon as={TbBoxMultiple} m="4px 4px 0 0" />}
        <Text cursor="pointer">{title}</Text>
      </Flex>
    );
  };

  return (
    <>
      <title>Calendar | TV Minder</title>
      {!followedShows.length && <NoFollowedShowsBanner />}
      <Box
        m="15px auto 20px"
        maxW="1600px"
        p={{ base: '0', md: '10px 30px' }}
        w={{ base: '90%', md: '100%' }}
      >
        <FullCalendar
          allDayContent={false}
          dayMaxEventRows={4}
          eventAllow={() => false} // do not allow dragging
          eventClick={onEventClick}
          eventContent={isMobile ? formatMobileEvent : formatDesktopEvent}
          events={calendarEpisodes}
          fixedWeekCount={false} // don't force showing additional weeks in calendar view
          height="auto"
          initialView={isMobile ? 'listMonth' : 'dayGridMonth'}
          key={moment().format('MM-DD-YYYY')} // refresh 'today' date highlight when needed
          // Format of the day titles in mobile view
          listDayFormat={{ month: 'long', day: 'numeric' }}
          listDaySideFormat={false}
          noEventsContent="New episodes will appear here!"
          plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
          ref={calendarRef}
          titleFormat={{ month: 'long' }}
          editable // enable mouse pointer cursor
        />
      </Box>
    </>
  );
};

export default CalendarPage;
