import React from 'react';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import 'style/fullCalendar.scss';

const CalendarPage = (): JSX.Element => {
  return (
    <Box>
      <Box maxW="80%" m="30px auto 0">
        <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />
      </Box>
    </Box>
  );
};

export default CalendarPage;
