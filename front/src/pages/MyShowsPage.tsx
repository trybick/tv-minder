import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Flex } from '@chakra-ui/react';
import { requestBasicShowInfoAction } from 'store/tv/actions';
import { selectFollowedShows } from 'store/user/selectors';
import ShowsWithRecentEpisodes from 'components/myShows/ShowsWithRecentEpisodes';
import ShowsWithUpcomingEpisodes from 'components/myShows/ShowsWithUpcomingEpisodes';
import AllShows from 'components/myShows/AllFollowedShows';

const MyShows = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, [dispatch, followedShows]);

  return (
    <>
      <Box m="30px auto" p={{ base: '0 10px', xl: '0 40px' }}>
        <Flex direction={{ base: 'column', xl: 'row' }} justify="center">
          <ShowsWithUpcomingEpisodes />
          <ShowsWithRecentEpisodes />
        </Flex>
      </Box>

      <AllShows />
    </>
  );
};

export default MyShows;
