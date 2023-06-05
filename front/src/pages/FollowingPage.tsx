import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Box } from '@chakra-ui/react';
import { useAppDispatch } from 'store';
import { getBasicShowInfoForFollowedShows } from 'store/tv/actions';
import { selectFollowedShows } from 'store/user/selectors';
import { useIsMobile } from 'hooks/useIsMobile';
import FollowingList from 'components/following/FollowingList';
import NoFollowedShowsMessage from 'components/following/NoFollowedShowsMessage';

const FollowingPage = () => {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const followedShows = useSelector(selectFollowedShows);

  useEffect(() => {
    dispatch(getBasicShowInfoForFollowedShows());
  }, [dispatch, followedShows]);

  return (
    <Box m="0 auto 30px" maxW="1170px" w={isMobile ? 'unset' : '90%'}>
      <Helmet title="Following | TV Minder" />
      {followedShows.length ? <FollowingList /> : <NoFollowedShowsMessage />}
    </Box>
  );
};

export default FollowingPage;
