import React from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/core';

interface Props {
  isLoading: boolean;
  shows: any[];
}

const loadingSpinner = () => (
  <Flex mt="8" justifyContent="center">
    <Spinner />
  </Flex>
);

const emptyListMessage = () => <Box>There are no shows</Box>;

const searchResults = (shows: Props['shows']) => (
  <Box>
    {shows.map((show: any) => (
      <Box key={show.id}>{show.name}</Box>
    ))}
  </Box>
);

const SearchResultsContainer = ({ isLoading, shows }: Props) =>
  isLoading ? loadingSpinner() : shows?.length ? searchResults(shows) : emptyListMessage();

export default SearchResultsContainer;
