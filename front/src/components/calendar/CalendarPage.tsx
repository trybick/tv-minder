import React, { useEffect, useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AppState } from 'store';
import { selectFollowedShows } from 'store/user/reducers';
import { getEpisodesForDisplay } from 'gateway/getEpisodes';
import { ID } from 'types/common';
import 'style/fullCalendar.scss';

interface StateProps {
  followedShows: ID[];
}

type Props = StateProps;

const CalendarPage = ({ followedShows }: Props): JSX.Element => {
  const [episodeData, setEpisodeData] = useState<any>();
  console.log('episodeData:', episodeData);

  useEffect(() => {
    async function loadSeasonEpisodes() {
      const episodeData = await getEpisodesForDisplay(followedShows[0]);

      setEpisodeData(episodeData);
    }

    loadSeasonEpisodes();
  }, []);

  return (
    <Box>
      <Box maxW="80%" m="30px auto 0">
        <FullCalendar
          defaultView="dayGridMonth"
          events={[
            { title: 'event 1', date: '2019-04-01' },
            { title: 'event 2', date: '2019-04-02' },
          ]}
          plugins={[dayGridPlugin]}
        />
      </Box>
    </Box>
  );
};

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (state: AppState) => ({
  followedShows: selectFollowedShows(state),
});

export default connect<StateProps, {}, {}, AppState>(mapStateToProps, {})(CalendarPage);
