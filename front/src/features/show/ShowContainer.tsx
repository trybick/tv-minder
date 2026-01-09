import { Flex, Grid } from '@chakra-ui/react';

import FollowButton from '~/components/FollowButton';
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
        <Grid gap="32px" gridTemplateColumns="300px 1fr">
          <Flex direction="column" gap="14px">
            <ShowImage />
            <FollowButton showId={showId} size="xl" />
          </Flex>
          <ShowDetails />
        </Grid>
      )}

      <SeasonAccordionGroup />
    </>
  );
};

export default ShowContainer;
