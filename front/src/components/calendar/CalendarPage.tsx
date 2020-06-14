import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { selectFollowedShows } from 'store/user/reducers';
import { saveEpisodeDataAction } from 'store/tv/actions';
import { selectEpisodeData } from 'store/tv/reducers';
import { fetchEpisodeData } from 'gateway/getEpisodes';
import 'style/fullCalendar.scss';

const CalendarPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const followedShowsIds = useSelector(selectFollowedShows);
  const storedEpisodeData = useSelector(selectEpisodeData);
  const [calendarEpisodes, setCalendarEpisodes] = useState<any>();

  useEffect(() => {
    async function loadEpisodesForCalendar() {
      const CACHE_DURATION = 5;
      const cachedIds = Object.keys(storedEpisodeData);
      const validCachedIds = followedShowsIds.filter(
        id =>
          cachedIds.includes(String(id)) &&
          CACHE_DURATION > moment().diff(moment(storedEpisodeData[id].fetchedAt), 'days')
      );
      const cachedData = validCachedIds.flatMap(id =>
        storedEpisodeData[id].episodes !== null ? Object.values(storedEpisodeData[id].episodes) : []
      );

      let fetchedData;
      const nonCachedIds = followedShowsIds.filter(id => !validCachedIds.includes(id));
      if (nonCachedIds) {
        const { cache, fetchedEpisodeData } = await fetchEpisodeData(nonCachedIds);
        fetchedData = fetchedEpisodeData;
        dispatch(saveEpisodeDataAction(cache));
      }

      const combinedEpisodesForDisplay = cachedData.concat(fetchedData);
      setCalendarEpisodes(combinedEpisodesForDisplay);
    }

    loadEpisodesForCalendar();
  }, [followedShowsIds]);

  const handleEventClick = (dateObj: any) => {
    const { title } = dateObj.event;
    console.log('event:', title, dateObj.event);
  };

  return (
    <Box>
      <Box maxW="80%" m="30px auto 0">
        <FullCalendar
          eventClick={handleEventClick}
          defaultView="dayGridMonth"
          events={calendarEpisodes}
          plugins={[dayGridPlugin, interactionPlugin]}
          eventLimit
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
