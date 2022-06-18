import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box } from '@chakra-ui/react';
import { AppState } from 'store';
import { getBasicShowInfoAndSeasonsWithEpisodesForShow } from 'store/tv/actions';
import { mapShowInfoForDisplay } from 'store/tv/tvUtils';
import { BasicShowInfo } from 'types/external';
import LoadingSpinner from 'components/common/LoadingSpinner';
import ShowContainer from 'components/showContainer/ShowContainer';
import { selectIsLoadingBasicShowInfoForShow } from 'store/tv/selectors';

const ShowPage = () => {
  const dispatch = useDispatch();
  const { showId } = useParams<{ showId: string }>();
  const showIdNum = +showId;
  const showInfo = useSelector((state: AppState) => state.tv.basicShowInfo[showIdNum]);
  const isLoading = useSelector(selectIsLoadingBasicShowInfoForShow);
  const showInfoForDisplay: BasicShowInfo = showInfo && mapShowInfoForDisplay(showInfo);

  useEffect(() => {
    dispatch(getBasicShowInfoAndSeasonsWithEpisodesForShow(showIdNum));
  }, [dispatch, showIdNum]);

  return isLoading ? (
    <LoadingSpinner delay={250} isFullScreen />
  ) : showIdNum === showInfo?.id ? (
    <Box m="20px auto 40px" maxW="800px" px={{ base: '20px', md: '30px' }}>
      <Helmet title={`${showInfoForDisplay.name} | TV Minder`} />
      <ShowContainer showInfoForDisplay={showInfoForDisplay} />
    </Box>
  ) : null;
};

export default ShowPage;
