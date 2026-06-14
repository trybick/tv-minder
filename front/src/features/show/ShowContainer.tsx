import { Flex, Grid } from '@chakra-ui/react';
import { useParams } from 'wouter';

import { TrackButton } from '~/components/TrackButton';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';
import { parseShowId } from '~/utils/parseShowId';

import { ReviewsSection } from './ReviewsSection';
import { SeasonsAccordion } from './SeasonsAccordion';
import { ShowImage } from './ShowImage';
import { VideoTrailerButton } from './VideoTrailerButton';
import { ShowDetails } from './showDetails/ShowDetails';

export const ShowContainer = () => {
  const { isMobile } = useResponsiveLayout();
  const { showId } = useParams<{ showId: string }>();
  const parsedShowId = parseShowId(showId);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  const { reviews = [], name, videoTrailerKey } = currentShowInfo || {};

  if (!parsedShowId) {
    return null;
  }

  if (isMobile) {
    return (
      <Flex direction="column" gap={4}>
        <Flex direction="column" align="center" gap={4}>
          <ShowImage />
          <Flex direction="column" gap={2} w="100%">
            <TrackButton
              showId={parsedShowId}
              size="lg"
              w="100%"
              showName={name ?? ''}
            />
            <VideoTrailerButton videoId={videoTrailerKey} />
          </Flex>
        </Flex>

        <ShowDetails />

        <Flex direction="column" gap={8}>
          {!isLoading && <ReviewsSection reviews={reviews} />}
          <SeasonsAccordion />
        </Flex>
      </Flex>
    );
  }

  return (
    <Grid gap={7} gridTemplateColumns="340px 1fr" alignItems="start">
      <Flex
        direction="column"
        gap={2.5}
        position="sticky"
        top="6"
        alignSelf="start"
      >
        <ShowImage />
        <TrackButton showId={parsedShowId} size="lg" showName={name ?? ''} />
        <VideoTrailerButton videoId={videoTrailerKey} />
      </Flex>

      <Flex direction="column" gap={8}>
        <ShowDetails />

        {!isLoading && <ReviewsSection reviews={reviews} />}

        <SeasonsAccordion />
      </Flex>
    </Grid>
  );
};
