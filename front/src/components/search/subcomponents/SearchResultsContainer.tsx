import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Flex, Spinner, Text } from '@chakra-ui/core';
import { AppState } from 'store';
import SearchResults from './SearchResults';

interface OwnProps {
  isInputDirty: boolean;
  isLoading: boolean;
  shows: any[];
  totalResults: number;
}

interface StateProps {
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
}: OwnProps & StateProps) => (
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

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState) => ({
  userFollows: state.userReducer.userFollows,
});

export default connect<StateProps, null, OwnProps, AppState>(
  mapStateToProps,
  null
)(SearchResultsContainer);
