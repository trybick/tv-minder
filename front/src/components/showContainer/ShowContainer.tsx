import { Flex, Grid, Image } from '@chakra-ui/react';

import FollowButton from '~/components/common/FollowButton';
import { ShowNavigationState } from '~/components/search/subcomponents/SearchResult';
import { fallbackImagePathLarge, imagePath780 } from '~/constants/strings';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingBasicShowInfoForShow,
} from '~/store/tv/selectors';

import SeasonAccordionGroup from './subcomponents/SeasonAccordionGroup/SeasonAccordionGroup';
import ShowDetails from './subcomponents/ShowDetails';

const ShowContainer = () => {
  const isMobile = useIsMobile();

  const { state } = window.history;
  const { showId, posterSource, backdropPath } = state as ShowNavigationState;

  const showInfoForDisplay = useAppSelector(selectCurrentShowInfo(showId));
  const isLoading = useAppSelector(selectIsLoadingBasicShowInfoForShow);
  // const isLoading = true;
  // const isLoading = false;

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
        src={imagePath780 + backdropPath}
        width="100vw"
        viewTransitionName={`show-${showId}`}
      />
    ) : (
      <Image
        borderRadius="8px"
        onError={e => (e.currentTarget.src = fallbackImagePathLarge)}
        src={posterSource || fallbackImagePathLarge}
        viewTransitionName={`show-${showId}`}
      />
    );
  };

  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap="12px">
          {renderImage()}
          <ShowDetails
            isLoading={isLoading}
            showInfoForDisplay={showInfoForDisplay}
          />
        </Flex>
      ) : (
        <Grid gap="22px" gridTemplateColumns=".7fr 1fr">
          <Flex direction="column" gap="12px">
            {renderImage()}
            <FollowButton showId={showId} />
          </Flex>
          <ShowDetails
            isLoading={isLoading}
            showInfoForDisplay={showInfoForDisplay}
          />
        </Grid>
      )}

      <SeasonAccordionGroup
        isLoading={isLoading}
        showInfoForDisplay={showInfoForDisplay}
      />
    </>
  );
};

export default ShowContainer;
