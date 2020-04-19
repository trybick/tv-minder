import React from 'react';
import { Box, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/core';

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

const WelcomeMessage = () => (
  <Flex mt="8" justifyContent="center">
    <Text>Welcome, search for a show</Text>
  </Flex>
);

const SearchResults = ({ shows }: { shows: Props['shows'] }) => (
  <Stack mt="8" spacing={4}>
    {shows.map((show) => (
      <Box p={3} shadow="md" borderWidth="1px" key={show.id}>
        <Heading size="sm">{show.name}</Heading>
      </Box>
    ))}
  </Stack>
);

const SearchResultsContainer = ({ isInputDirty, isLoading, shows }: Props) =>
  isLoading ? (
    <LoadingSpinner />
  ) : shows?.length ? (
    <SearchResults shows={shows} />
  ) : isInputDirty ? (
    <EmptyListMessage />
  ) : (
    <WelcomeMessage />
  );

export default SearchResultsContainer;
