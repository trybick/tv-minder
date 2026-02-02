import { Box, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Carousel } from '~/components/Carousel';
import { mapTmdbShowSummary, type ShowItem } from '~/components/ShowCard';
import { useAppSelector } from '~/store';
import { selectCurrentShowInfo } from '~/store/tv/selectors';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { tmdbApi } from '~/store/tv/utils/tmdbApi';

import { SimilarShowCard } from './SimilarShowCard';

const keyExtractor = (show: ShowItem) => show.id;
const renderItem = (show: ShowItem) => <SimilarShowCard show={show} />;

export const SimilarShows = () => {
  const showInfo = useAppSelector(selectCurrentShowInfo);
  const [similarShows, setSimilarShows] = useState<TmdbShowSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!showInfo?.id) {
      return;
    }

    queueMicrotask(() => {
      setIsLoading(true);
    });
    tmdbApi
      .getRecommendations(showInfo.id)
      .then(data => {
        setSimilarShows(data.results);
      })
      .catch(() => setSimilarShows([]))
      .finally(() => setIsLoading(false));
  }, [showInfo?.id]);

  const showItems = similarShows.map(mapTmdbShowSummary);

  if (isLoading) {
    return (
      <Box mt={10}>
        <Skeleton height="24px" width="200px" mb={4} />
        <Skeleton height="300px" />
      </Box>
    );
  }

  if (showItems.length < 5) {
    return null;
  }

  return (
    <Box mt={10}>
      <VStack align="flex-start" gap={1} mb={4}>
        <Heading size="lg">Similar Shows</Heading>
        {showInfo?.name && (
          <Text color="fg.muted" fontSize="sm">
            {`Because you're viewing ${showInfo.name}`}
          </Text>
        )}
      </VStack>
      <Carousel
        items={showItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        size="sm"
      />
    </Box>
  );
};
