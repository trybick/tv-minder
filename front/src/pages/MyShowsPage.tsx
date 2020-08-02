import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@chakra-ui/core';
import { requestBasicShowInfoAction } from 'store/tv/actions';
import { selectBasicShowInfoForDisplay } from 'store/tv/selectors';
import { selectFollowedShows } from 'store/user/selectors';
import RecentEpisodes from 'components/myShows/RecentEpisodes';

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
      <RecentEpisodes showsInfo={showsInfo} />
    </Box>
  );
};

export default MyShows;
