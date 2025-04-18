import { Flex, Grid, Image } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { useIsMobile } from 'hooks/useIsMobile';
import { imagePath342, imagePath780 } from 'constants/strings';
import { fallbackImagePathLarge } from 'constants/strings';
import FollowButton from 'components/common/FollowButton';
import ShowDetails from './subcomponents/ShowDetails';
import SeasonAccordionGroup from './subcomponents/SeasonAccordionGroup/SeasonAccordionGroup';

type Props = {
  showInfoForDisplay: BasicShowInfo;
};

const ShowContainer = ({ showInfoForDisplay }: Props) => {
  const isMobile = useIsMobile();
  const { backdropPath, id, posterPath } = showInfoForDisplay || {};
  const hasEpisodes =
    showInfoForDisplay.seasonsWithEpisodes[0]?.episodes.length;

  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap="12px">
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
          />
          <ShowDetails
            isMobile={isMobile}
            showInfoForDisplay={showInfoForDisplay}
          />
        </Flex>
      ) : (
        <Grid gap="22px" gridTemplateColumns=".8fr 1fr">
          <Flex direction="column" gap="12px">
            <Image
              borderRadius="8px"
              onError={e => (e.currentTarget.src = fallbackImagePathLarge)}
              src={
                posterPath ? imagePath342 + posterPath : fallbackImagePathLarge
              }
            />
            <FollowButton showId={id} />
          </Flex>
          <ShowDetails
            isMobile={isMobile}
            showInfoForDisplay={showInfoForDisplay}
          />
        </Grid>
      )}

      {hasEpisodes && (
        <SeasonAccordionGroup
          isMobile={isMobile}
          showInfoForDisplay={showInfoForDisplay}
        />
      )}
    </>
  );
};

export default ShowContainer;
