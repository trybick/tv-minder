import { Box, Grid, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

import { getStatusBadge, mapTmdbShowSummary } from '~/components/ShowCard';
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

export const SearchResults = ({ shows, totalResults }: Props) => {
  const totalMatchesText = `${totalResults} ${maybePluralize(totalResults, 'result')}`;
  const showDetails = useAppSelector(selectShowDetails);
  const searchShowDetails = useAppSelector(selectSearchShowDetails);

  const showItems = useMemo(() => shows.map(mapTmdbShowSummary), [shows]);

  /**
   * Search results don't have status info in the initial data (TmdbShowSummary).
   * We need to look up cached show details to derive the status badge.
   * This is different from the Following page where ShowForDisplay already
   * includes the computed status.
   */
  const getSearchStatusBadge = (showId: number) => {
    const cachedShow = showDetails?.[showId] ?? searchShowDetails?.[showId];
    if (!cachedShow) {
      return null;
    }
    const { status } = mapShowInfoForDisplay(cachedShow);
    return getStatusBadge(status);
  };

  return (
    <Box w="100%" maxW="1200px" px={{ base: '3', md: '6' }}>
      <Text fontSize="md" color="fg.muted" textAlign="right" mb="4">
        {totalMatchesText}
      </Text>

      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        gap={{ base: '3', md: '4' }}
      >
        {showItems.map(show => (
          <SearchResultCard
            key={show.id}
            show={show}
            badge={getSearchStatusBadge(show.id)}
          />
        ))}
      </Grid>
    </Box>
  );
};
