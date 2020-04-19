import React from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/core';

interface Props {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: any[];
}

const LoadingSpinner = () => (
  <Flex mt="8" justifyContent="center">
    <Spinner />
  </Flex>
);

const EmptyListMessage = () => (
  <Flex mt="8" justifyContent="center">
    <Text>There are no shows to display</Text>
  </Flex>
);

const SearchResults = ({ shows }: { shows: Props['shows'] }) => (
  <Box>
    {shows.map((show: any) => (
      <Box key={show.id}>{show.name}</Box>
    ))}
  </Box>
);

const SearchResultsContainer = ({ isInputDirty, isLoading, shows }: Props) =>
  isLoading ? (
    <LoadingSpinner />
  ) : shows?.length ? (
    <SearchResults shows={shows} />
  ) : (
    <>{isInputDirty && <EmptyListMessage />}</>
  );

export default SearchResultsContainer;
