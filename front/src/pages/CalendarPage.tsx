import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
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

  return (
    <Box mb="25px">
      <Box maxW="1170px" m="30px auto 0" p="0 25px">
        <FullCalendar
          eventAllow={() => false} // do not allow dragging
          events={calendarEpisodes}
          initialView={window.innerWidth > 667 ? 'dayGridMonth' : 'dayGridWeek'}
          plugins={[dayGridPlugin, interactionPlugin]}
          dayMaxEventRows // display popover if events overflow in a day
          editable // enable mouse pointer cursor
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
