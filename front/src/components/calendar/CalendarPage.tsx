import React from 'react';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import 'style/fullCalendar.scss';

const CalendarPage = (): JSX.Element => {
  return (
    <Box>
      <Box>Calendar</Box>
      <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />
    </Box>
  );
};

export default CalendarPage;
