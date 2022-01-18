import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { css, Global } from '@emotion/react';
import FullCalendar, { EventContentArg, FormatterInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { selectFollowedShows } from 'store/user/selectors';
import { loadEpisodesForCalendar } from 'store/tv/actions';
import { selectCalendarEpisodesForDisplay } from 'store/tv/selectors';
import { useIsMobile } from 'hooks/useIsMobile';
import theme from 'theme';

const CalendarPage = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const calendarEpisodes = useSelector(selectCalendarEpisodesForDisplay);
  const isMobile = useIsMobile();
  const { colorMode } = useColorMode();

  useEffect(() => {
    dispatch(loadEpisodesForCalendar());
  }, [dispatch, followedShows]);

  const addPopoverToEvent = (eventInfo: EventContentArg) => (
    <Popover placement="top" trigger="hover">
      <PopoverTrigger>
        <Text overflow="hidden">{eventInfo.event.title}</Text>
      </PopoverTrigger>
      <Portal>
        <PopoverContent bg={eventInfo.backgroundColor} width="unset" zIndex={4}>
          <PopoverArrow bg={eventInfo.backgroundColor} />
          <PopoverBody>
            <Text color="white" fontSize="sm">
              {eventInfo.event.title}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );

  const titleFormat: FormatterInput = {
    month: isMobile ? 'short' : 'long',
    year: 'numeric',
  };

  return (
    <Box m="15px auto 0" maxW="1170px" p="0 25px">
      <Global
        styles={css`
          // While in dark mode, change calendar column titles to dark color
          .fc-col-header-cell {
            background-color: ${colorMode === 'dark' ? theme.colors.darkBlack : theme.colors.white};
          }
        `}
      />
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
