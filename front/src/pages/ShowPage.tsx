import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Box } from '@chakra-ui/react';
import { getBasicShowInfoAndSeasonsWithEpisodesForShow } from 'store/tv/actions';
import LoadingSpinner from 'components/common/LoadingSpinner';
import ShowContainer from 'components/showContainer/ShowContainer';
import { selectCurrentShowInfo, selectIsLoadingBasicShowInfoForShow } from 'store/tv/selectors';
import { useGetShowIdFromParams } from 'hooks/useGetShowIdFromParams';

const ShowPage = () => {
  const dispatch = useDispatch();
  const showId = useGetShowIdFromParams();
  const isLoading = useSelector(selectIsLoadingBasicShowInfoForShow);
  const showInfoForDisplay = useSelector(selectCurrentShowInfo);

  useEffect(() => {
    dispatch(getBasicShowInfoAndSeasonsWithEpisodesForShow(showId));
  }, [dispatch, showId]);

  return isLoading ? (
    <LoadingSpinner delay={250} isFullScreen />
  ) : showId === showInfoForDisplay?.id ? (
    <Box m="20px auto 40px" maxW="800px" px={{ base: '20px', md: '30px' }}>
      <Helmet title={`${showInfoForDisplay.name} | TV Minder`} />
      <ShowContainer showInfoForDisplay={showInfoForDisplay} />
    </Box>
  ) : null;
};

export default ShowPage;
