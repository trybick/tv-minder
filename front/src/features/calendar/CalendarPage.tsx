import { Box, Flex, Icon, Spinner, Text } from '@chakra-ui/react';
import {
  type CalendarOptions,
  type DatesSetArg,
  type EventClickArg,
  type EventContentArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { TbBoxMultiple } from 'react-icons/tb';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch, useAppSelector } from '~/store';
import { trackApi } from '~/store/rtk/api/track.api';
import {
  selectTrackedShowIds,
  selectTrackedShows,
} from '~/store/rtk/slices/user.selectors';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { getEpisodesForCalendarAction } from '~/store/tv/actions';
import {
  selectCalendarEpisodesForDisplay,
  selectIsLoadingCalendarEpisodes,
} from '~/store/tv/selectors';
import { trackEvent } from '~/utils/analytics';
import { dayjs } from '~/utils/dayjs';

import { CalendarEmptyState } from './CalendarEmptyState';
import { CalendarHeader } from './CalendarHeader';
import { CalendarSkeleton } from './CalendarSkeleton';
import { DesktopCalendarEventPopover } from './DesktopCalendarEventPopover';
import { NoTrackedShowsBanner } from './NoTrackedShowsBanner';

const formatDesktopEvent = (
  eventInfo: EventContentArg & { backgroundColor: string }
) => <DesktopCalendarEventPopover eventInfo={eventInfo} />;

const formatMobileEvent = (eventInfo: EventContentArg) => {
  const { title } = eventInfo.event;
  const { isMultipleEvent } = eventInfo.event.extendedProps;
  return (
    <Flex>
      {isMultipleEvent && <Icon as={TbBoxMultiple} m="4px 4px 0 0" />}
      <Text cursor="pointer">{title}</Text>
    </Flex>
  );
};

export const CalendarPage = () => {
  const dispatch = useAppDispatch();
  const [, navigate] = useLocation();
  const { isMobile } = useResponsiveLayout();
  const calendarRef = useRef<FullCalendar>(null);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const prevViewStartRef = useRef<Date | null>(null);

  const [calendarTitle, setCalendarTitle] = useState('');
  const [viewRange, setViewRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const trackedShows = useAppSelector(selectTrackedShows);
  const trackedShowIds = useAppSelector(selectTrackedShowIds);
  const calendarEpisodes = useAppSelector(selectCalendarEpisodesForDisplay);
  const isLoadingCalendarEpisodes = useAppSelector(
    selectIsLoadingCalendarEpisodes
  );
  const {
    isLoading: isLoadingTrackedShows,
    isUninitialized: isTrackedShowsUninitialized,
  } = useAppSelector(trackApi.endpoints.getTrackedShows.select(undefined));

  useEffect(() => {
    const loadEpisodes = () => {
      if (document.visibilityState === 'visible') {
        dispatch(getEpisodesForCalendarAction());
      }
    };
    loadEpisodes();

    window.addEventListener('visibilitychange', loadEpisodes);
    return () => window.removeEventListener('visibilitychange', loadEpisodes);
  }, [dispatch, trackedShowIds]);

  useEffect(() => {
    const changeView = (view: string) =>
      calendarRef.current?.getApi().changeView(view);
    if (isMobile) {
      changeView('listMonth');
    } else {
      changeView('dayGridMonth');
    }
  }, [isMobile]);

  useEffect(() => {
    if (isLoggedIn) {
      calendarRef.current?.getApi().today();
    }
  }, [isLoggedIn]);

  const onEventClick = (eventInfo: EventClickArg) => {
    const showId = eventInfo.event.extendedProps.showId;
    const showName = eventInfo.event.extendedProps.showName;
    trackEvent({
      category: 'Calendar',
      action: 'Event Clicked',
      label: `${showName} (${showId.toString()})`,
    });
    navigate(`${ROUTES.SHOW}/${showId}`);
  };

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    setCalendarTitle(dateInfo.view.title);
    setViewRange({ start: dateInfo.start, end: dateInfo.end });

    const el = calendarWrapperRef.current;
    if (el && prevViewStartRef.current) {
      const isSameMonth =
        dateInfo.start.getTime() === prevViewStartRef.current.getTime();
      if (!isSameMonth) {
        const animationName =
          dateInfo.start > prevViewStartRef.current
            ? 'calendarSlideFromRight'
            : 'calendarSlideFromLeft';
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = `${animationName} 0.25s ease-out`;
      }
    }
    prevViewStartRef.current = dateInfo.start;
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
    noEventsContent: isLoadingCalendarEpisodes ? (
      isMobile ? (
        <Flex align="center" gap={2} justify="center" py={6}>
          <Spinner size="sm" />
          <Text fontSize="14px">Loading episodes</Text>
        </Flex>
      ) : null
    ) : (
      <NoTrackedShowsBanner />
    ),
    plugins: [dayGridPlugin, interactionPlugin, listPlugin],
    ref: calendarRef as RefObject<FullCalendar>,
    titleFormat: { month: 'long' },
    // Enable 'cursor: pointer' on events
    editable: true,
    datesSet: handleDatesSet,
  };

  const isTrackedShowsPending =
    isLoadingTrackedShows || (isLoggedIn && isTrackedShowsUninitialized);
  const isInitialLoading = isTrackedShowsPending || isLoadingCalendarEpisodes;
  const hasCachedCalendarData = calendarEpisodes.length > 0;
  const hasTrackedShows = !isInitialLoading && !!trackedShows.length;
  const shouldShowSkeleton = isInitialLoading && !hasCachedCalendarData;
  const shouldShowCalendar =
    hasTrackedShows || (hasCachedCalendarData && !!trackedShows.length);

  return (
    <>
      <title>Calendar | TV Minder</title>

      <Box
        m="14px auto 20px"
        maxW="1400px"
        p={{ base: '0', md: '10px 30px' }}
        w={{ base: '90%', md: '100%' }}
      >
        {shouldShowSkeleton ? (
          <CalendarSkeleton />
        ) : shouldShowCalendar ? (
          <>
            <CalendarHeader
              calendarRef={calendarRef}
              title={calendarTitle}
              viewRange={viewRange}
            />
            <Box ref={calendarWrapperRef}>
              <FullCalendar
                {...calendarProps}
                key={dayjs().format('MM-DD-YYYY')}
              />
            </Box>
          </>
        ) : (
          <CalendarEmptyState />
        )}
      </Box>
    </>
  );
};
