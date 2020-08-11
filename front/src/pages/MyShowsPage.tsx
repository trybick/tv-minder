import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Flex, Grid } from '@chakra-ui/core';
import { requestBasicShowInfoAction } from 'store/tv/actions';
import ShowsWithRecentEpisodes from 'components/myShows/ShowsWithRecentEpisodes';
import ShowsWithUpcomingEpisodes from 'components/myShows/ShowsWithUpcomingEpisodes';
import AllShows from 'components/myShows/AllFollowedShows';

const MyShows = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, [dispatch]);

  return (
    <Box m="30px auto" p="0 40px">
      <Flex direction={{ base: 'column', lg: 'row' }} justify="center">
        <ShowsWithUpcomingEpisodes />
        <ShowsWithRecentEpisodes />
      </Flex>

      <AllShows />
    </Box>
  );
};

export default MyShows;
