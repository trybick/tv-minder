import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/react';
import { useAppDispatch } from 'store';
import { getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow } from 'store/tv/actions';
import LoadingSpinner from 'components/common/LoadingSpinner';
import ShowContainer from 'components/showContainer/ShowContainer';
import {
  getCurrentShowId,
  selectCurrentShowInfo,
  selectIsLoadingBasicShowInfoForShow,
} from 'store/tv/selectors';
import { useIsMobile } from 'hooks/useIsMobile';

const ShowPage = () => {
  const dispatch = useAppDispatch();
  const showId = getCurrentShowId();
  const isLoading = useSelector(selectIsLoadingBasicShowInfoForShow);
  const showInfoForDisplay = useSelector(selectCurrentShowInfo);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow(showId));
  }, [dispatch, showId]);

  return isLoading || !showInfoForDisplay?.id || showId !== showInfoForDisplay?.id ? (
    <LoadingSpinner delay={250} isFullScreen />
  ) : (
    <>
      <title>{showInfoForDisplay.name} | TV Minder</title>
      <Box
        m={isMobile ? '12px auto 40px' : '24px auto 40px'}
        maxW="800px"
        px={{ base: '20px', md: '30px' }}
      >
        <ShowContainer showInfoForDisplay={showInfoForDisplay} />
      </Box>
    </>
  );
};

export default ShowPage;
