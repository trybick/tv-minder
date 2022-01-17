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

const CalendarPage = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const calendarEpisodes = useSelector(selectCalendarEpisodesForDisplay);

  useEffect(() => {
    dispatch(loadEpisodesForCalendar());
  }, [dispatch, followedShows]);

  const addPopover = (eventInfo: EventContentArg) => (
    <Popover placement="top" trigger="hover" usePortal>
      <PopoverTrigger>
        <div>{eventInfo.event.title}</div>
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

  const isMobile = window.innerWidth < 667;

  const titleFormat: FormatterInput = {
    month: isMobile ? 'short' : 'long',
    year: 'numeric',
  };

  return (
    <Box m="15px auto 0" maxW="1170px" p="0 25px">
      <FullCalendar
        allDayContent={false}
        eventAllow={() => false} // do not allow dragging
        eventContent={addPopover}
        events={calendarEpisodes}
        height="auto"
        initialView={window.innerWidth > 667 ? 'dayGridMonth' : 'listMonth'}
        plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
        titleFormat={titleFormat}
        dayMaxEventRows // display popover if events overflow in a day
        editable // enable mouse pointer cursor
      />
    </Box>
  );
};

export default CalendarPage;
