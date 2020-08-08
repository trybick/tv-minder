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
  const recentShows = useSelector(selectBasicShowInfoForDisplay);
  console.log('recentShows:', recentShows);

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, [dispatch, followedShows]);

  return (
    <Grid gap={12} m="30px auto" p="0 20px" maxWidth="1400px" templateColumns="1fr 1fr">
      <ShowsWithRecentEpisodes shows={recentShows} />
      <ShowsWithUpcomingEpisodes shows={recentShows} />

      {/* All shows will show up at bottom of page */}
      {/* <AllShows showsInfo={showsInfo} /> */}
    </Grid>
  );
};

export default MyShows;
