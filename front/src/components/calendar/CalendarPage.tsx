import React, { useEffect, useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AppState } from 'store';
import { selectFollowedShows } from 'store/user/reducers';
import { getSchedule } from 'gateway/getEpisodes';
import { ID } from 'types/common';
import 'style/fullCalendar.scss';

interface StateProps {
  followedShows: ID[];
}

type Props = StateProps;

const CalendarPage = ({ followedShows }: Props): JSX.Element => {
  const [episodes, setEpisodes] = useState([]);
  console.log('episodes to show:', episodes);

  useEffect(() => {
    async function loadSeasonEpisodes() {
      const schedule = await getSchedule(followedShows[0]);

      setEpisodes(schedule);
    }

    loadSeasonEpisodes();
  }, []);

  return (
    <Box>
      <Box maxW="80%" m="30px auto 0">
        <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />
      </Box>
    </Box>
  );
};

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (state: AppState) => ({
  followedShows: selectFollowedShows(state),
});

export default connect<StateProps, {}, {}, AppState>(mapStateToProps, {})(CalendarPage);
