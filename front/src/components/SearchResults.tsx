import React from 'react';
import { Box } from '@chakra-ui/core';

interface Props {
  isLoading: boolean;
  shows: any[];
}

const SearchResults = ({ isLoading, shows }: Props) =>
  isLoading ? (
    <Box>Loading</Box>
  ) : shows?.length ? (
    <Box>
      {shows.map((show: any) => (
        <Box key={show.id}>{show.name}</Box>
      ))}
    </Box>
  ) : (
    <Box>There are no shows</Box>
  );

export default SearchResults;
