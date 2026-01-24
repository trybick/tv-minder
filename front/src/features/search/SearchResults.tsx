import { Box, Grid, Text } from '@chakra-ui/react';

import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { maybePluralize } from '~/utils/formatting';

import { SearchResult } from './SearchResult';

type Props = {
  shows: TmdbShowSummary[];
  totalResults: number;
};

export const SearchResults = ({ shows, totalResults }: Props) => {
  const totalMatchesText = `${totalResults} ${maybePluralize(totalResults, 'result')}`;

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
        {shows.map(show => (
          <SearchResult key={show.id} showToDisplay={show} />
        ))}
      </Grid>
    </Box>
  );
};
