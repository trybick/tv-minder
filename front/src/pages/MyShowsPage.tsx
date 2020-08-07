import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@chakra-ui/core';

import { requestBasicShowInfoAction } from 'store/tv/actions';
import { selectBasicShowInfoForDisplay } from 'store/tv/selectors';
import { selectFollowedShows } from 'store/user/selectors';
import RecentEpisode from 'components/myShows/RecentEpisode';

const MyShows = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const showsInfo = useSelector(selectBasicShowInfoForDisplay);
  console.log('showsInfo:', showsInfo);

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, [dispatch, followedShows]);

  return (
    <Box maxW="85%" m="40px auto 0">
      <Grid justifyContent="center" templateColumns="repeat(auto-fill, 400px)" gap={6}>
        {showsInfo?.map(show => {
          return <RecentEpisode key={show.id} show={show} />;
        })}
      </Grid>
    </Box>
  );
};

export default MyShows;
