import React from 'react';
import { Box } from '@chakra-ui/core';

const SearchResults = (shows: any) => {
  return shows?.shows?.length ? (
    <Box>
      {shows.shows.map((show: any) => (
        <Box key={show.id}>{show.name}</Box>
      ))}
    </Box>
  ) : (
    <Box>There are no shows</Box>
  );
};

export default SearchResults;
