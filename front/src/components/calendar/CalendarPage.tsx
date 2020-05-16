import React, { useEffect, useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Box } from '@chakra-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
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
  const [episodes, setEpisodes] = useState<any>();

  useEffect(() => {
    async function loadEpisodesForCalendar() {
      setEpisodes(await getEpisodesForDisplay(followedShows));
    }
    loadEpisodesForCalendar();
  }, []);

  const handleEventClick = (dateObj: any) => {
    const {
      event: { title },
    } = dateObj;
    console.log('title:', title);
  };

  return (
    <Box>
      <Box maxW="80%" m="30px auto 0">
        <FullCalendar
          eventClick={handleEventClick}
          defaultView="dayGridMonth"
          events={episodes}
          plugins={[dayGridPlugin, interactionPlugin]}
        />
      </Box>
    </Box>
  );
};

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (state: AppState) => ({
  followedShows: selectFollowedShows(state),
});

export default connect<StateProps, {}, {}, AppState>(mapStateToProps, {})(CalendarPage);
