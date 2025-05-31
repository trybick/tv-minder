import { Flex, Grid } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import FollowButton from '~/components/FollowButton';
import LoadingSpinner from '~/components/LoadingSpinner';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

import SeasonAccordionGroup from './SeasonAccordionGroup';
import ShowDetails from './ShowDetails';
import ShowImage from './ShowImage';

const ShowContainer = () => {
  const isMobile = useIsMobile();
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);
  const showId = getShowIdFromUrl();

  if (!showDataFromHistory && !currentShowInfo) {
    return <LoadingSpinner isFullScreen />;
  }

  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap="12px">
          <ShowImage />
          <ShowDetails />
        </Flex>
      ) : (
        <Grid gap="22px" gridTemplateColumns=".7fr 1fr">
          <Flex direction="column" gap="12px">
            <ShowImage />
            <FollowButton showId={showId} />
          </Flex>
          <ShowDetails />
        </Grid>
      )}

      <SeasonAccordionGroup />
    </>
  );
};

export default ShowContainer;
