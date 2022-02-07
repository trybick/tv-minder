import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box } from '@chakra-ui/react';
import { AppState } from 'store';
import { getBasicShowInfoAndSeasonsWithEpisodesForShow } from 'store/tv/actions';
import { mapShowInfoForDisplay } from 'store/tv/tvUtils';
import { BasicShowInfo } from 'types/external';
import ShowContainer from 'components/showContainer/ShowContainer';

const ShowPage = () => {
  const dispatch = useDispatch();
  const { showId } = useParams<{ showId: string }>();
  const showIdNum = +showId;
  const showInfo = useSelector((state: AppState) => state.tv.basicShowInfo[showIdNum]);
  const showInfoForDisplay: BasicShowInfo = showInfo && mapShowInfoForDisplay(showInfo);

  useEffect(() => {
    dispatch(getBasicShowInfoAndSeasonsWithEpisodesForShow(showIdNum));
  }, [dispatch, showIdNum]);

  // This check is to avoid flashing the previous show on first render
  return showIdNum === showInfo?.id ? (
    <Box m="20px auto 40px" maxW="800px" px={{ base: '20px', md: '30px' }}>
      <Helmet title={`${showInfoForDisplay.name} | TV Minder`} />
      <ShowContainer showInfoForDisplay={showInfoForDisplay} />
    </Box>
  ) : null;
};

export default ShowPage;
