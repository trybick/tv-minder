import { Flex, Grid } from '@chakra-ui/react';

import { FollowButton } from '~/components/FollowButton';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import { selectCurrentShowInfo } from '~/store/tv/selectors';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

import { SeasonsAccordion } from './SeasonsAccordion';
import { ShowImage } from './ShowImage';
import { RichContent } from './showDetails/RichContent';
import { ShowDetails } from './showDetails/ShowDetails';

export const ShowContainer = () => {
  const { isMobile } = useResponsiveLayout();
  const showId = getShowIdFromUrl();
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);

  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap="12px">
          <ShowImage />
          <ShowDetails />
        </Flex>
      ) : (
        <Grid gap="32px" gridTemplateColumns="280px 1fr">
          <Flex direction="column" gap="14px">
            <ShowImage />
            <FollowButton showId={showId} size="lg" />
          </Flex>
          <ShowDetails />
        </Grid>
      )}

      <Flex
        direction="column"
        gap={{ base: 8, md: 10 }}
        mt={{ base: 8, md: 10 }}
      >
        <RichContent show={currentShowInfo} />
        <SeasonsAccordion />
      </Flex>
    </>
  );
};
