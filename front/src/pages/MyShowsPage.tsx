import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import { getBasicShowInfoForFollowedShows } from 'store/tv/actions';
import { selectFollowedShows } from 'store/user/selectors';
import MyShowsTable from 'components/myShowsTable/MyShowsTable';
import NoFollowShowsMessage from 'components/myShowsTable/NoFollowShowsMessage';

const MyShowsPage = () => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);

  useEffect(() => {
    dispatch(getBasicShowInfoForFollowedShows());
  }, [dispatch, followedShows]);

  return (
    <Box m="0 auto 30px" maxW="1170px" w="90%">
      {followedShows.length ? <MyShowsTable /> : <NoFollowShowsMessage />}
    </Box>
  );
};

export default MyShowsPage;
