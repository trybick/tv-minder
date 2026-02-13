import { Box, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import {
  getStatusBadge,
  mapTmdbShowSummary,
  ShowCard,
} from '~/components/ShowCard';
import { useAppSelector } from '~/store';
import {
  selectSearchShowDetails,
  selectShowDetails,
} from '~/store/tv/selectors';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { mapShowInfoForDisplay } from '~/store/tv/utils/formatting';
import { maybePluralize } from '~/utils/formatting';

import { SearchResultCard } from './SearchResultCard';

type Props = {
  shows: TmdbShowSummary[];
  totalResults: number;
};

export const FilteredResults = ({ shows, totalResults }: Props) => {
  const showDetails = useAppSelector(selectShowDetails);
  const searchShowDetails = useAppSelector(selectSearchShowDetails);

  const showItems = useMemo(
    () => shows.filter(s => s.poster_path).map(mapTmdbShowSummary),
    [shows]
  );

  const getSearchStatusBadge = (showId: number) => {
    const cachedShow = showDetails?.[showId] ?? searchShowDetails?.[showId];
    if (!cachedShow) {
      return null;
    }
    const { status } = mapShowInfoForDisplay(cachedShow);
    return getStatusBadge(status);
  };

  if (!showItems.length) {
    return (
      <Box textAlign="center" py="16">
        <Text color="fg.muted" fontSize="lg">
          No shows match your filters
        </Text>
        <Text color="fg.subtle" fontSize="sm" mt="1">
          Try adjusting your criteria
        </Text>
      </Box>
    );
  }

  const totalMatchesText = `${totalResults} ${maybePluralize(totalResults, 'result')}`;

  return (
    <Box w="100%" maxW="1200px" px={{ base: '3', md: '6' }}>
      <Text fontSize="md" color="fg.muted" textAlign="right" mb="4">
        {totalMatchesText}
      </Text>

      <ShowCard.Grid>
        {showItems.map(show => (
          <SearchResultCard
            key={show.id}
            show={show}
            badge={getSearchStatusBadge(show.id)}
          />
        ))}
      </ShowCard.Grid>
    </Box>
  );
};
