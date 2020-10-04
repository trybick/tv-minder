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
      <Box m="30px auto 0" maxW="1170px" p="0 25px">
        <FullCalendar
          dayMaxEventRows // do not allow dragging
          editable
          eventAllow={() => false}
          events={calendarEpisodes}
          initialView={window.innerWidth > 667 ? 'dayGridMonth' : 'dayGridWeek'} // display popover if events overflow in a day
          plugins={[dayGridPlugin, interactionPlugin]} // enable mouse pointer cursor
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
