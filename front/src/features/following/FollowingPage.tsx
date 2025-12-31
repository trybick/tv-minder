import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import { useGetFollowedShowsQuery } from '~/store/rtk/api/follow.api';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { getShowDetailsForFollowedShows } from '~/store/tv/actions';

import FollowingList from './FollowingList';
import NoFollowedShowsMessage from './NoFollowedShowsMessage';

const FollowingPage = () => {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const followedShows = useAppSelector(selectFollowedShows);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const { isLoading } = useGetFollowedShowsQuery(undefined, {
    skip: !isLoggedIn,
  });

  useEffect(() => {
    dispatch(getShowDetailsForFollowedShows());
  }, [dispatch, followedShows]);

  const isNoFollowedShows = !isLoading && followedShows.length === 0;

  return (
    <>
      <title>Manage | TV Minder</title>
      <Box m="0 auto 30px" maxW="1170px" w={isMobile ? 'unset' : '90%'}>
        {isNoFollowedShows ? <NoFollowedShowsMessage /> : <FollowingList />}
      </Box>
    </>
  );
};

export default FollowingPage;
