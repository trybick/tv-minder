import React from 'react';
import {
  Flex,
  Spinner,
  Text,
  Stat,
  StatLabel,
  StatHelpText,
  Box,
} from '@chakra-ui/core';
import { ShowSearchResult } from 'types/external';
import SearchResults from './subcomponents/SearchResults';

interface Props {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: ShowSearchResult[];
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
    <Stat borderWidth="1px" padding="12px" shadow="sm">
      <StatLabel>Keep track of your favorite shows with this app</StatLabel>
      <Box d='flex' flexDirection='column' alignItems='center'>
        <StatHelpText>Search for a show now !</StatHelpText>
      </Box>
    </Stat>
  </Flex>
);

const SearchContainer = ({ isInputDirty, isLoading, shows, totalResults }: Props) => (
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

export default SearchContainer;
