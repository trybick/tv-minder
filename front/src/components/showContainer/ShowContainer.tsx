import { Flex, Grid, Image } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import FollowButton from '~/components/common/FollowButton';
import { fallbackImagePathLarge, imagePath780 } from '~/constants/strings';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  getCurrentShowId,
  selectCurrentShowInfo,
  selectIsLoadingBasicShowInfoForShow,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';

import SeasonAccordionGroup from './subcomponents/SeasonAccordionGroup/SeasonAccordionGroup';
import ShowDetails from './subcomponents/ShowDetails';

const ShowContainer = () => {
  const isMobile = useIsMobile();

  const isLoading = useAppSelector(selectIsLoadingBasicShowInfoForShow);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);

  const renderImage = () => {
    return isMobile ? (
      <Image
        // This styling lets the image extend beyond parent to be 100vw
        left="50%"
        maxW="100vw"
        ml="-50vw"
        mr="-50vw"
        position="relative"
        right="50%"
        src={imagePath780 + showDataFromHistory?.backdropPath}
        width="100vw"
        viewTransitionName={showDataFromHistory?.imageViewTransitionName}
      />
    ) : (
      <Image
        borderRadius="8px"
        onError={e => (e.currentTarget.src = fallbackImagePathLarge)}
        src={
          showDataFromHistory?.posterSource ||
          imagePath780 + currentShowInfo?.posterPath ||
          fallbackImagePathLarge
        }
        viewTransitionName={showDataFromHistory?.imageViewTransitionName}
      />
    );
  };

  if (!showDataFromHistory && !currentShowInfo) {
    // add spinner
    return null;
  }

  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap="12px">
          {renderImage()}
          <ShowDetails
            isLoading={isLoading}
            currentShowInfo={currentShowInfo}
          />
        </Flex>
      ) : (
        <Grid gap="22px" gridTemplateColumns=".7fr 1fr">
          <Flex direction="column" gap="12px">
            {renderImage()}
            <FollowButton
              showId={
                showDataFromHistory?.showId ||
                currentShowInfo?.id ||
                getCurrentShowId()
              }
            />
          </Flex>
          <ShowDetails
            isLoading={isLoading}
            currentShowInfo={currentShowInfo}
          />
        </Grid>
      )}

      <SeasonAccordionGroup
        isLoading={isLoading}
        currentShowInfo={currentShowInfo}
      />
    </>
  );
};

export default ShowContainer;
