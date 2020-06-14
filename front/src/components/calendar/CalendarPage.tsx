import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { selectFollowedShows } from 'store/user/reducers';
import { saveEpisodeDataAction } from 'store/tv/actions';
import { selectEpisodeData } from 'store/tv/reducers';
import { getEpisodesForDisplay } from 'gateway/getEpisodes';
import 'style/fullCalendar.scss';

const CalendarPage = (): JSX.Element => {
  const dispatch = useDispatch();
  const followedShowsIds = useSelector(selectFollowedShows);
  const storedEpisodeData = useSelector(selectEpisodeData);
  const [episodes, setEpisodes] = useState<any>();

  useEffect(() => {
    async function loadEpisodesForCalendar() {
      // Import savedEpisodeData here and check if any of the followedShowIds are saved there
      // Create array of showIds to get from store and another array to get from network

      const storedKeys = Object.keys(storedEpisodeData);
      const cachedIds = followedShowsIds.filter(id => storedKeys.includes(String(id)));
      const nonCachedIds = followedShowsIds.filter(id => !cachedIds.includes(id));

      // Get cached ids from store

      const finalEpisodesData = cachedIds
        .flatMap(id => {
          if (storedEpisodeData[id] !== null) return Object.values(storedEpisodeData[id]);
        })
        .filter(Boolean);
      console.log('finalEpisodeData:', finalEpisodesData);

      // Get non-cached ids from network

      const { cache, episodesForDisplay } = await getEpisodesForDisplay(followedShowsIds);
      console.log('episodesForDisplay:', episodesForDisplay);
      setEpisodes(episodesForDisplay);
      dispatch(saveEpisodeDataAction(cache));
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
          events={episodes}
          plugins={[dayGridPlugin, interactionPlugin]}
          eventLimit
        />
      </Box>
    </Box>
  );
};

export default CalendarPage;
