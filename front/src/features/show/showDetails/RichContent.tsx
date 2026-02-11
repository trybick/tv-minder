import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';

import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

import { Reviews } from './richContent/Reviews';
import { Trailers } from './richContent/Trailers';
import { WatchProviders } from './richContent/WatchProviders';

type Props = {
  show?: ShowForDisplay | null;
};

export const RichContent = ({ show }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { trailers = [], reviews = [], watchProviders } = show || {};

  if (isLoading) {
    return null;
  }

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

  if (!availableWatchProviders && !hasTrailers && !hasReviews) {
    return null;
  }

  return (
    <Box pt={6} borderTop="1px solid" borderColor="whiteAlpha.100">
      <Flex mb={5} direction="column" gap={1}>
        <Heading
          as="h2"
          fontSize={{ base: 'xl', md: '2xl' }}
          letterSpacing="-0.02em"
        >
          Watch and Extras
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          Where to watch, trailers, and audience reviews.
        </Text>
      </Flex>

      {(availableWatchProviders || hasTrailers) && (
        <Grid
          templateColumns={{
            base: '1fr',
            md: availableWatchProviders && hasTrailers ? '1fr 1fr' : '1fr',
          }}
          gap={5}
          alignItems="start"
        >
          {availableWatchProviders && (
            <WatchProviders watchProviders={availableWatchProviders} />
          )}
          {hasTrailers && <Trailers trailers={trailers} />}
        </Grid>
      )}

      {hasReviews && (
        <Box mt={availableWatchProviders || hasTrailers ? 5 : 0}>
          <Reviews reviews={reviews} />
        </Box>
      )}
    </Box>
  );
};
