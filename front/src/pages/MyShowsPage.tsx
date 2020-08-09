import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Grid } from '@chakra-ui/core';
import { requestBasicShowInfoAction } from 'store/tv/actions';
import ShowsWithRecentEpisodes from 'components/myShows/ShowsWithRecentEpisodes';
import ShowsWithUpcomingEpisodes from 'components/myShows/ShowsWithUpcomingEpisodes';
import AllShows from 'components/myShows/AllShows';

const MyShows = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, [dispatch]);

  return (
    <Box m="30px auto" p="0 40px" maxWidth="1400px">
      <Grid gap="5rem" templateColumns="1fr 1fr">
        <ShowsWithUpcomingEpisodes />
        <ShowsWithRecentEpisodes />
      </Grid>

      <AllShows />
    </Box>
  );
};

export default MyShows;
