import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Box } from '@chakra-ui/react';
import { useAppDispatch } from 'store';
import { getBasicShowInfoForFollowedShows } from 'store/tv/actions';
import { selectFollowedShows } from 'store/user/selectors';
import MyShowsList from 'components/myShows/MyShowsList';
import NoFollowedShowsMessage from 'components/myShows/NoFollowedShowsMessage';

const MyShowsPage = () => {
  const dispatch = useAppDispatch();
  const followedShows = useSelector(selectFollowedShows);

  useEffect(() => {
    dispatch(getBasicShowInfoForFollowedShows());
  }, [dispatch, followedShows]);

  return (
    <Box m="0 auto 30px" maxW="1170px" w="90%">
      <Helmet title="My Shows | TV Minder" />
      {followedShows.length ? <MyShowsList /> : <NoFollowedShowsMessage />}
    </Box>
  );
};

export default MyShowsPage;
