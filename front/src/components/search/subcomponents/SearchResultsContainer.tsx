import React from 'react';
import { connect } from 'react-redux';
import { Flex, Spinner, Text } from '@chakra-ui/core';
import SearchResults from './SearchResults';

interface Props {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: any[];
  totalResults: number;
  userFollows?: any[];
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

const SearchResultsContainer = ({
  isInputDirty,
  isLoading,
  shows,
  totalResults,
  userFollows,
}: Props) => (
  <Flex justify="center" m="0 auto">
    {isLoading ? (
      <LoadingSpinner />
    ) : shows?.length ? (
      <SearchResults shows={shows} totalResults={totalResults} userFollows={userFollows} />
    ) : isInputDirty ? (
      <EmptyListMessage />
    ) : (
      <WelcomeMessage />
    )}
  </Flex>
);

const mapStateToProps = (state: any) => ({
  // Why is this necessary
  userFollows: state.userFollows['userFollows'],
});

export default connect(mapStateToProps, null)(SearchResultsContainer);
