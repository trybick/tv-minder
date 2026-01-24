import { Box, Stack, Tag } from '@chakra-ui/react';

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
    <Box m="0 auto">
      <Box mr={{ base: '14px', md: '2px' }} textAlign="right">
        <Tag.Root colorPalette="gray" fontSize="0.84rem" mb="24px" size="lg">
          {totalMatchesText}
        </Tag.Root>
      </Box>

      <Stack gap={5} m="0 auto" w={{ base: '96%', md: '500px' }}>
        {shows.map(show => (
          <SearchResult key={show.id} showToDisplay={show} />
        ))}
      </Stack>
    </Box>
  );
};
