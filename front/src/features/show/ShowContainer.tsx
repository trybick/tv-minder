import { Flex, Grid } from '@chakra-ui/react';

import { FollowButton } from '~/components/FollowButton';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

import { SeasonsAccordion } from './SeasonsAccordion';
import { ShowImage } from './ShowImage';
import { ShowDetails } from './showDetails/ShowDetails';

export const ShowContainer = () => {
  const { isMobile } = useResponsiveLayout();
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

      <SeasonsAccordion />
    </>
  );
};
