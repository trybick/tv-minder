import React from 'react';
import { Box, Stack, Tag } from '@chakra-ui/core';
import SearchResult from './SearchResult';

interface Props {
  hasLocalWarningToastBeenShown?: boolean;
  setHasLocalWarningToastBeenShown: any;
  shows: any[];
  totalResults: number;
  userFollows?: any[];
}

const SearchResults = ({
  hasLocalWarningToastBeenShown,
  setHasLocalWarningToastBeenShown,
  shows,
  totalResults,
  userFollows,
}: Props) => {
  const casedMatches = totalResults === 1 ? 'match' : 'matches';
  const totalMatchesText = `${totalResults} ${casedMatches} found`;

  return (
    <Box>
      <Box textAlign="right">
        <Tag size="sm" mb="24px" fontSize="0.84rem">
          {totalMatchesText}
        </Tag>
      </Box>

      <Stack w={['xs', 'sm', 'md', 'lg']} spacing={4}>
        {shows.map((show) => (
          <SearchResult
            hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
            key={show.id}
            setHasLocalWarningToastBeenShown={setHasLocalWarningToastBeenShown}
            show={show}
            userFollows={userFollows}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SearchResults;
