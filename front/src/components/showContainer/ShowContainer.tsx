import { Flex, Image } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { useIsMobile } from 'hooks/useIsMobile';
import { imagePath342 } from 'constants/strings';
import { fallbackImagePathLarge } from 'constants/strings';
import FollowButton from 'components/common/FollowButton';
import ShowDetails from './subcomponents/ShowDetails';
import SeasonAccordionGroup from './subcomponents/SeasonAccordionGroup/SeasonAccordionGroup';

type Props = {
  showInfoForDisplay: BasicShowInfo;
};

const ShowContainer = ({ showInfoForDisplay }: Props) => {
  const isMobile = useIsMobile();
  const { id, posterPath } = showInfoForDisplay || {};
  const hasEpisodes = showInfoForDisplay.seasonsWithEpisodes[0]?.episodes.length;

  return (
    <>
      <Flex gap="20px">
        {!isMobile && (
          <Flex direction="column" gap="12px">
            <Image
              borderRadius="8px"
              fallbackSrc={fallbackImagePathLarge}
              fallbackStrategy="onError"
              src={posterPath ? imagePath342 + posterPath : fallbackImagePathLarge}
            />

            <FollowButton showId={id} />
          </Flex>
        )}
        <ShowDetails isMobile={isMobile} showInfoForDisplay={showInfoForDisplay} />
      </Flex>

      {hasEpisodes && (
        <SeasonAccordionGroup isMobile={isMobile} showInfoForDisplay={showInfoForDisplay} />
      )}
    </>
  );
};

export default ShowContainer;
