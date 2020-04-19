import React from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/core';

interface Props {
  isLoading: boolean;
  shows: any[];
}

const LoadingSpinner = () => (
  <Flex mt="8" justifyContent="center">
    <Spinner />
  </Flex>
);

const EmptyListMessage = () => <Box>There are no shows</Box>;

const SearchResults = ({ shows }: { shows: Props['shows'] }) => (
  <Box>
    {shows.map((show: any) => (
      <Box key={show.id}>{show.name}</Box>
    ))}
  </Box>
);

const SearchResultsContainer = ({ isLoading, shows }: Props) =>
  isLoading ? (
    <LoadingSpinner />
  ) : shows?.length ? (
    <SearchResults shows={shows} />
  ) : (
    <EmptyListMessage />
  );

export default SearchResultsContainer;
