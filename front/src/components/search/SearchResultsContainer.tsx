import React from 'react';
import { Box, Flex, Spinner, Stack, Text } from '@chakra-ui/core';
import SearchResult from './SearchResult';

interface Props {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: any[];
  totalResults: number;
}

const LoadingSpinner = () => (
  <Flex justifyContent="center">
    <Spinner />
  </Flex>
);

const EmptyListMessage = () => (
  <Flex justifyContent="center">
    <Text>There are no shows to display</Text>
  </Flex>
);

const WelcomeMessage = () => (
  <Flex justifyContent="center">
    <Text>Welcome, search for a show</Text>
  </Flex>
);

const SearchResults = ({ shows, totalResults }: Pick<Props, 'shows' | 'totalResults'>) => (
  <Box>
    <Text mb="24px" fontSize="0.84rem" textAlign="right">
      {totalResults} matches found
    </Text>
    <Stack w={['xs', 'sm', 'md', 'lg']} spacing={4}>
      {shows.map((show) => (
        <SearchResult key={show.id} show={show} />
      ))}
    </Stack>
  </Box>
);

const SearchResultsContainer = ({ isInputDirty, isLoading, shows, totalResults }: Props) => (
  <Flex justify="center" m="0 auto">
    {isLoading ? (
      <LoadingSpinner />
    ) : shows?.length ? (
      <SearchResults shows={shows} totalResults={totalResults} />
    ) : isInputDirty ? (
      <EmptyListMessage />
    ) : (
      <WelcomeMessage />
    )}
  </Flex>
);

export default SearchResultsContainer;
