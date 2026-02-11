import { Box, Flex, Grid } from '@chakra-ui/react';

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
import { Trailers } from './showDetails/richContent/Trailers';
import { WatchProviders } from './showDetails/richContent/WatchProviders';

export const ShowContainer = () => {
  const { isMobile } = useResponsiveLayout();
  const showId = getShowIdFromUrl();
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  const { trailers = [], reviews = [], watchProviders } = currentShowInfo || {};

  const availableWatchProviders =
    watchProviders &&
    !!(
      watchProviders.flatrate.length ||
      watchProviders.rent.length ||
      watchProviders.buy.length
    )
      ? watchProviders
      : null;
  const hasTrailers = !!trailers.length;
  const hasReviews = !!reviews.length;

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
        {!isLoading && (availableWatchProviders || hasTrailers) && (
          <Grid
            templateColumns={{
              base: '1fr',
              md: availableWatchProviders && hasTrailers ? '1fr 1fr' : '1fr',
            }}
            gap={5}
            alignItems="start"
            overflow="hidden"
          >
            {availableWatchProviders && (
              <Box minW={0}>
                <WatchProviders
                  showName={currentShowInfo?.name ?? ''}
                  watchProviders={availableWatchProviders}
                />
              </Box>
            )}
            {hasTrailers && (
              <Box minW={0}>
                <Trailers trailers={trailers} />
              </Box>
            )}
          </Grid>
        )}

        {!isLoading && hasReviews && <Reviews reviews={reviews} />}

        <SeasonsAccordion />
      </Flex>
    </>
  );
};
