import { Flex, Image, useMediaQuery } from '@chakra-ui/react';
import { BasicShowInfo } from 'types/external';
import { fallbackImagePath, imagePath342 } from 'constants/strings';
import FollowButton from './subcomponents/FollowButton';
import ShowDetails from './subcomponents/ShowDetails';
import SeasonAccordionGroup from './subcomponents/SeasonAccordionGroup/SeasonAccordionGroup';

interface Props {
  showInfoForDisplay: BasicShowInfo;
}

const ShowContainer = ({ showInfoForDisplay }: Props) => {
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);
  const { id, posterPath } = showInfoForDisplay || {};

  return (
    <>
      <Flex gap="20px">
        {!isMobile && (
          <Flex direction="column" gap="12px">
            <Image
              borderRadius="8px"
              fallbackSrc={fallbackImagePath}
              src={imagePath342 + posterPath}
            />
            <FollowButton showId={id} />
          </Flex>
        )}
        <ShowDetails isMobile={isMobile} showInfoForDisplay={showInfoForDisplay} />
      </Flex>

      <SeasonAccordionGroup showInfoForDisplay={showInfoForDisplay} />
    </>
  );
};

export default ShowContainer;
