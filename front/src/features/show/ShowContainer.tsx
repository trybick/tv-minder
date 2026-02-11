import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';

import { FollowButton } from '~/components/FollowButton';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

import { SeasonsAccordion } from './SeasonsAccordion';
import { ShowImage } from './ShowImage';
import { ShowDetails } from './showDetails/ShowDetails';
import { Reviews } from './showDetails/richContent/Reviews';
import { Videos } from './showDetails/richContent/Videos';
import { WatchProviders } from './showDetails/richContent/WatchProviders';

export const ShowContainer = () => {
  const { isMobile } = useResponsiveLayout();
  const showId = getShowIdFromUrl();
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  const { videos = [], reviews = [], watchProviders } = currentShowInfo || {};

  const availableWatchProviders =
    watchProviders &&
    !!(
      watchProviders.flatrate.length ||
      watchProviders.rent.length ||
      watchProviders.buy.length
    )
      ? watchProviders
      : null;

  return (
    <>
      {isMobile ? (
        <Flex direction="column" gap="12px">
          <ShowImage />
          <ShowDetails />
        </Flex>
      ) : (
        <Grid gap={7} gridTemplateColumns="280px 1fr" alignItems="start">
          <Flex direction="column" gap={4}>
            <ShowImage />
            <FollowButton showId={showId} size="lg" />
          </Flex>
          <ShowDetails />
        </Grid>
      )}

      <Flex
        direction="column"
        gap={{ base: 8, md: 10 }}
        mt={{ base: 5, md: 10 }}
      >
        {!isLoading && (
          <>
            <Box>
              <Grid
                templateColumns={{ base: '1fr', md: '1fr 1fr' }}
                gap={5}
                alignItems="start"
                overflow="hidden"
              >
                <Box minW={0}>
                  <WatchProviders
                    showName={currentShowInfo?.name ?? ''}
                    watchProviders={availableWatchProviders}
                  />
                </Box>
                <Box minW={0}>
                  <Videos videos={videos} />
                </Box>
              </Grid>
            </Box>

            <Box>
              <Flex mb={5} direction="column" gap={1}>
                <Heading
                  as="h2"
                  fontSize={{ base: 'xl', md: '2xl' }}
                  letterSpacing="-0.02em"
                >
                  Reviews
                </Heading>
                <Text color="fg.muted" fontSize="sm">
                  What viewers are saying about this show.
                </Text>
              </Flex>

              <Reviews reviews={reviews} />
            </Box>
          </>
        )}

        <SeasonsAccordion />
      </Flex>
    </>
  );
};
