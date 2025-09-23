import { Flex, Grid } from '@chakra-ui/react';

import { FollowButton } from '~/components/FollowButton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

import SeasonAccordionGroup from './SeasonAccordionGroup';
import ShowDetails from './ShowDetails';
import ShowImage from './ShowImage';

const ShowContainer = () => {
  const isMobile = useIsMobile();
  const showId = getShowIdFromUrl();

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
