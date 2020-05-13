import React, { useEffect } from 'react';
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
  useEffect(() => {
    async function loadSeasonEpisodes() {
      const schedule = await getSchedule(followedShows[0]);

      return schedule;
    }

    loadSeasonEpisodes();
  }, [followedShows]);

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
