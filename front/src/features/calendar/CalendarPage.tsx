import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import {
  CalendarOptions,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import moment from 'moment';
import { RefObject, useEffect, useRef, useState } from 'react';
import { TbBoxMultiple } from 'react-icons/tb';

import { ROUTES } from '~/app/routes';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppDispatch, useAppSelector } from '~/store';
import { getEpisodesForCalendarAction } from '~/store/legacy/tv/actions';
import { selectCalendarEpisodesForDisplay } from '~/store/legacy/tv/selectors';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';

import CustomCalendarHeader from './CustomCalendarHeader';
import DesktopCalendarEventPopover from './DesktopCalendarEventPopover';

const CalendarPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigateWithAnimation();
  const isMobile = useIsMobile();
  const calendarRef = useRef<FullCalendar>(null);
  const [hasEpisodesInCurrentMonth, setHasEpisodesInCurrentMonth] =
    useState(true);
  const [calendarTitle, setCalendarTitle] = useState('');

  const followedShows = useAppSelector(selectFollowedShows);
  const calendarEpisodes = useAppSelector(selectCalendarEpisodesForDisplay);

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
    const changeView = (view: string) =>
      calendarRef.current?.getApi().changeView(view);
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

  const formatDesktopEvent = (
    eventInfo: EventContentArg & { backgroundColor: string }
  ) => <DesktopCalendarEventPopover eventInfo={eventInfo} />;

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

  const handleDatesSet = () => {
    const view = calendarRef.current?.getApi().view;
    if (!view) {
      return;
    }

    setCalendarTitle(view.title);

    const hasEvents = calendarEpisodes.some(episode => {
      return moment(episode.date).isBetween(
        moment(view.activeStart),
        moment(view.activeEnd),
        'day',
        '[]'
      );
    });

    setHasEpisodesInCurrentMonth(hasEvents);
  };

  const calendarProps: CalendarOptions & {
    ref: RefObject<FullCalendar>;
  } = {
    allDayContent: false,
    dayMaxEventRows: 4,
    // Do not allow dragging events around
    eventAllow: () => false,
    eventClick: onEventClick,
    eventContent: isMobile ? formatMobileEvent : formatDesktopEvent,
    events: calendarEpisodes,
    // Don't force showing additional weeks in calendar view
    fixedWeekCount: false,
    height: 'auto',
    // Disable default toolbar - using custom header
    headerToolbar: false,
    initialView: isMobile ? 'listMonth' : 'dayGridMonth',
    // Format of the day titles in mobile view
    listDayFormat: { month: 'long', day: 'numeric' },
    listDaySideFormat: false,
    noEventsContent: 'New episodes will appear here!',
    plugins: [dayGridPlugin, interactionPlugin, listPlugin],
    ref: calendarRef as RefObject<FullCalendar>,
    titleFormat: { month: 'long' },
    // Enable 'cursor: pointer' on events
    editable: true,
    datesSet: handleDatesSet,
  };

  return (
    <>
      <title>Calendar | TV Minder</title>

      <Box
        m="15px auto 20px"
        maxW="1600px"
        p={{ base: '0', md: '10px 30px' }}
        w={{ base: '90%', md: '100%' }}
      >
        <CustomCalendarHeader
          calendarRef={calendarRef}
          hasEpisodesInCurrentMonth={hasEpisodesInCurrentMonth}
          title={calendarTitle}
        />
        <FullCalendar
          {...calendarProps}
          // Refreshes the calendar to update the correct day
          key={moment().format('MM-DD-YYYY')}
        />
      </Box>
    </>
  );
};

export default CalendarPage;
