import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { useParams } from 'wouter';

import { TrackButton } from '~/components/TrackButton';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';

import { SeasonsAccordion } from './SeasonsAccordion';
import { ShowImage } from './ShowImage';
import { VideoTrailerButton } from './VideoTrailerButton';
import { ShowDetails } from './showDetails/ShowDetails';
import { Reviews } from './showDetails/richContent/Reviews';

export const ShowContainer = () => {
  const { isMobile } = useResponsiveLayout();
  const { showId } = useParams<{ showId: string }>();
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  const { reviews = [], name, videoTrailerKey } = currentShowInfo || {};

  if (isMobile) {
    return (
      <Flex direction="column" gap={4}>
        <Flex direction="column" align="center" gap={4}>
          <ShowImage />
          <Flex direction="column" gap={2} w="100%">
            <TrackButton
              showId={+showId}
              size="lg"
              w="100%"
              showName={name ?? ''}
            />
            <VideoTrailerButton videoId={videoTrailerKey} />
          </Flex>
        </Flex>

        <ShowDetails />

        <Flex direction="column" gap={8}>
          {!isLoading && (
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
          )}
          <SeasonsAccordion />
        </Flex>
      </Flex>
    );
  }

  return (
    <Grid gap={7} gridTemplateColumns="280px 1fr" alignItems="start">
      <Flex
        direction="column"
        gap={2.5}
        position="sticky"
        top="24px"
        alignSelf="start"
      >
        <ShowImage />
        <TrackButton showId={+showId} size="lg" showName={name ?? ''} />
        <VideoTrailerButton videoId={videoTrailerKey} />
      </Flex>

      <Flex direction="column" gap={8}>
        <ShowDetails />

        {!isLoading && (
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
        )}

        <SeasonsAccordion />
      </Flex>
    </Grid>
  );
};
