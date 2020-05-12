import React, { useEffect } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AppState } from 'store';
import { selectFollowedShows } from 'store/user/reducers';
import { getNumberSeasons, getSeasonEpisodes } from 'gateway/getEpisodes';
import { ID } from 'types/common';
import 'style/fullCalendar.scss';

interface StateProps {
  followedShows: ID[];
}

type Props = StateProps;

const CalendarPage = ({ followedShows }: Props): JSX.Element => {
  useEffect(() => {
    // Make request to get number of seasons in the show
    async function loadNumberSeasons() {
      const numSeasons = await getNumberSeasons(followedShows[0]);
      return numSeasons;
    }

    // Make a call to API for one show ID
    async function loadSeasonEpisodes() {
      const season1Details = await getSeasonEpisodes(followedShows[0], 1);
      return season1Details;
    }

    loadNumberSeasons();
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
