import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/core';
import FullCalendar, { EventContentArg, FormatterInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { selectFollowedShows } from 'store/user/selectors';
import { loadEpisodesForCalendar } from 'store/tv/actions';
import { selectCalendarEpisodesForDisplay } from 'store/tv/selectors';
import { useIsMobile } from 'hooks/useIsMobile';

const CalendarPage = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const calendarEpisodes = useSelector(selectCalendarEpisodesForDisplay);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(loadEpisodesForCalendar());
  }, [dispatch, followedShows]);

  const addPopoverToEvent = (eventInfo: EventContentArg) => (
    <Popover placement="top" trigger="hover" usePortal>
      <PopoverTrigger>
        <Text overflow="hidden">{eventInfo.event.title}</Text>
      </PopoverTrigger>
      <PopoverContent bg={eventInfo.backgroundColor} width="unset" zIndex={4}>
        <PopoverArrow />
        <PopoverBody>
          <Text color="white" fontSize="sm">
            {eventInfo.event.title}
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );

  const titleFormat: FormatterInput = {
    month: isMobile ? 'short' : 'long',
    year: 'numeric',
  };

  return (
    <Box m="15px auto 0" maxW="1170px" p="0 25px">
      <FullCalendar
        allDayContent={false}
        eventAllow={() => false} // do not allow dragging
        eventContent={addPopoverToEvent}
        events={calendarEpisodes}
        height="auto"
        initialView={isMobile ? 'listMonth' : 'dayGridMonth'}
        plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
        titleFormat={titleFormat}
        dayMaxEventRows // display popover if events overflow in a day
        editable // enable mouse pointer cursor
      />
    </Box>
  );
};

export default CalendarPage;
