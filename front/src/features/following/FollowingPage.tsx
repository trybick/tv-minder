import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

import FollowingList from '~/features/following/FollowingList';
import NoFollowedShowsMessage from '~/components/following/NoFollowedShowsMessage';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import { getBasicShowInfoForFollowedShows } from '~/store/tv/actions';
import { selectFollowedShows } from '~/store/user/selectors';

const FollowingPage = () => {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const followedShows = useAppSelector(selectFollowedShows);

  useEffect(() => {
    dispatch(getBasicShowInfoForFollowedShows());
  }, [dispatch, followedShows]);

  return (
    <>
      <title>Following | TV Minder</title>
      <Box m="0 auto 30px" maxW="1170px" w={isMobile ? 'unset' : '90%'}>
        {followedShows.length ? <FollowingList /> : <NoFollowedShowsMessage />}
      </Box>
    </>
  );
};

export default FollowingPage;
