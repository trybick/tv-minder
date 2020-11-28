import React from 'react';
import { Flex, Spinner, Text } from '@chakra-ui/core';
import { ShowSearchResult } from 'types/external';
import SearchResults from './subcomponents/SearchResults';
import PopularShows from 'components/popularShows/PopularShows';

interface Props {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: ShowSearchResult[];
  totalResults: number;
}

const LoadingSpinner = () => (
  <Spinner
    color="blue.500"
    emptyColor="gray.200"
    mt="26px"
    size="xl"
    speed="0.65s"
    thickness="4px"
  />
);

const SearchContainer = ({ isInputDirty, isLoading, shows, totalResults }: Props) => (
  <Flex justify="center" justifyContent="center" m="0 auto">
    {isLoading ? (
      <LoadingSpinner />
    ) : shows?.length ? (
      <SearchResults shows={shows} totalResults={totalResults} />
    ) : isInputDirty ? (
      <Text mt="24px">There are no shows to display.</Text>
    ) : (
      <PopularShows />
    )}
  </Flex>
);

export default SearchContainer;
