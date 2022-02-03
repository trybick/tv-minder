import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppState } from 'store';
import { getBasicShowInfoWithSeasonsAndEpisodesForShow } from 'store/tv/actions';
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
    dispatch(getBasicShowInfoWithSeasonsAndEpisodesForShow(showIdNum));
  }, [dispatch, showIdNum]);

  // This check is to avoid flashing the previous show on first render
  return showIdNum === showInfo?.id ? (
    <ShowContainer showInfoForDisplay={showInfoForDisplay} />
  ) : null;
};

export default ShowPage;
