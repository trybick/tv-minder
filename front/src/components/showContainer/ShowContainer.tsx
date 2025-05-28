import { Flex, Grid } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import FollowButton from '~/components/common/FollowButton';
import LoadingSpinner from '~/components/common/LoadingSpinner';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  getShowIdFromUrl,
  selectCurrentShowInfo,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';

import SeasonAccordionGroup from './subcomponents/SeasonAccordionGroup/SeasonAccordionGroup';
import ShowDetails from './subcomponents/ShowDetails';
import ShowImage from './subcomponents/ShowImage';

const ShowContainer = () => {
  const isMobile = useIsMobile();
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);

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
            <FollowButton
              showId={
                showDataFromHistory?.showId ||
                currentShowInfo?.id ||
                getShowIdFromUrl()
              }
            />
          </Flex>
          <ShowDetails />
        </Grid>
      )}

      <SeasonAccordionGroup />
    </>
  );
};

export default ShowContainer;
