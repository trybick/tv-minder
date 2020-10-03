import React from 'react';
import { Flex, Spinner, Text,Image } from '@chakra-ui/core';
import { ShowSearchResult } from 'types/external';
import SearchResults from './subcomponents/SearchResults';
import cam from '../../images/camera.png';
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
    <Text>Ready with your snack?</Text>
    <Text>Search your favourite show!</Text>
    {/* <Image src={cam} alt="camera" /> */}

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
