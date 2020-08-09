import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@chakra-ui/core';

import { requestBasicShowInfoAction } from 'store/tv/actions';
import { selectBasicShowInfoForDisplay } from 'store/tv/selectors';
import { selectFollowedShows } from 'store/user/selectors';
import ShowsWithRecentEpisodes from 'components/myShows/ShowsWithRecentEpisodes';
import ShowsWithUpcomingEpisodes from 'components/myShows/ShowsWithUpcomingEpisodes';
import AllShows from 'components/myShows/AllShows';

const MyShows = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const basicShowsInfo = useSelector(selectBasicShowInfoForDisplay);
  console.log('basicShowsInfo:', basicShowsInfo);

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, [dispatch, followedShows]);

  return (
    <Box m="30px auto" p="0 40px" maxWidth="1400px">
      <Grid gap="5rem" templateColumns="1fr 1fr">
        <ShowsWithUpcomingEpisodes shows={basicShowsInfo} />
        <ShowsWithRecentEpisodes shows={basicShowsInfo} />
      </Grid>

      <AllShows showsInfo={basicShowsInfo} />
    </Box>
  );
};

export default MyShows;
