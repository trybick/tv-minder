import { Box, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';

import { Carousel } from '~/components/Carousel';
import { mapTmdbShowSummary, type ShowItem } from '~/components/ShowCard';
import { useAppDispatch, useAppSelector } from '~/store';
import { getRecommendationsForSingleShow } from '~/store/tv/actions';
import {
  selectCurrentShowInfo,
  selectRecommendations,
} from '~/store/tv/selectors';

import { SimilarShowCard } from './SimilarShowCard';

const keyExtractor = (show: ShowItem) => show.id;
const renderItem = (show: ShowItem) => <SimilarShowCard show={show} />;

export const SimilarShows = () => {
  const dispatch = useAppDispatch();
  const showInfo = useAppSelector(selectCurrentShowInfo);
  const recommendations = useAppSelector(selectRecommendations);

  const showId = showInfo?.id;
  const similarShows = showId ? recommendations[showId] : undefined;

  useEffect(() => {
    if (showId) {
      dispatch(getRecommendationsForSingleShow(showId));
    }
  }, [dispatch, showId]);

  const showItems = similarShows?.map(mapTmdbShowSummary) ?? [];

  if (!similarShows) {
    return (
      <Box mt={12} pt={8} borderTop="1px solid" borderColor="whiteAlpha.100">
        <Skeleton height="24px" width="200px" mb={4} />
        <Skeleton height="300px" />
      </Box>
    );
  }

  if (showItems.length < 5) {
    return null;
  }

  return (
    <Box mt={12} pt={8} borderTop="1px solid" borderColor="whiteAlpha.100">
      <VStack align="flex-start" gap={1} mb={4}>
        <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} letterSpacing="-0.02em">
          Similar Shows
        </Heading>
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
