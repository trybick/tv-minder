import { Flex, Image, useMediaQuery } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { imagePath342 } from 'constants/strings';
import FollowButton from 'components/common/FollowButton';
import ShowDetails from './subcomponents/ShowDetails';
import SeasonAccordionGroup from './subcomponents/SeasonAccordionGroup/SeasonAccordionGroup';

interface Props {
  showInfoForDisplay: BasicShowInfo;
}

const ShowContainer = ({ showInfoForDisplay }: Props) => {
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  const { id, posterPath } = showInfoForDisplay || {};
  const hasEpisodes = showInfoForDisplay.seasonsWithEpisodes[0]?.episodes.length;

  return (
    <>
      <Flex gap="20px">
        {!isMobile && (
          <Flex direction="column" gap="12px">
            {posterPath && <Image borderRadius="8px" src={imagePath342 + posterPath} />}
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
