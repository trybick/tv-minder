import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

import LoadingSpinner from '~/components/common/LoadingSpinner';
import ShowContainer from '~/components/showContainer/ShowContainer';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import { getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow } from '~/store/tv/actions';
import {
  getCurrentShowId,
  selectCurrentShowInfo,
  selectIsLoadingBasicShowInfoForShow,
} from '~/store/tv/selectors';

const ShowPage = () => {
  const dispatch = useAppDispatch();
  const showId = getCurrentShowId();
  const isLoading = useAppSelector(selectIsLoadingBasicShowInfoForShow);
  const showInfoForDisplay = useAppSelector(selectCurrentShowInfo);
  const isMobile = useIsMobile();

  useEffect(() => {
    dispatch(getBasicShowInfoAndSeasonsWithEpisodesForCurrentShow(showId));
  }, [dispatch, showId]);

  return isLoading ||
    !showInfoForDisplay?.id ||
    showId !== showInfoForDisplay?.id ? (
    <LoadingSpinner delay={250} isFullScreen />
  ) : (
    <>
      <title>{`${showInfoForDisplay.name} | TV Minder`}</title>
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
