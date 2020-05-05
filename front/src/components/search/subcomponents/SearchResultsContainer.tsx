import React from 'react';
import { connect } from 'react-redux';
import { Flex, Spinner, Text } from '@chakra-ui/core';
import { setHasLocalWarningToastBeenShownAction } from 'store/follows/actions';
import SearchResults from './SearchResults';

interface OwnProps {
  isInputDirty: boolean;
  isLoading: boolean;
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
  shows: any[];
  totalResults: number;
}

// interface ComponentDispatchProps {
//   doSomeAction: typeof someAction;
// }

interface StateProps {
  userFollows?: any[];
  hasLocalWarningToastBeenShown?: boolean;
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
  hasLocalWarningToastBeenShown,
  isInputDirty,
  isLoading,
  setHasLocalWarningToastBeenShown,
  shows,
  totalResults,
  userFollows,
}: OwnProps & StateProps) => (
  <Flex justify="center" m="0 auto">
    {isLoading ? (
      <LoadingSpinner />
    ) : shows?.length ? (
      <SearchResults
        setHasLocalWarningToastBeenShown={setHasLocalWarningToastBeenShown}
        shows={shows}
        totalResults={totalResults}
        userFollows={userFollows}
        hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
      />
    ) : isInputDirty ? (
      <EmptyListMessage />
    ) : (
      <WelcomeMessage />
    )}
  </Flex>
);

const mapStateToProps = (state: any) => ({
  userFollows: state.followReducer.userFollows,
  hasLocalWarningToastBeenShown: state.followReducer.hasLocalWarningToastBeenShown,
});

const mapDispatchToProps = (dispatch: any) => ({
  setHasLocalWarningToastBeenShown: () => dispatch(setHasLocalWarningToastBeenShownAction()),
});

export default connect<StateProps, null, OwnProps>(
  mapStateToProps,
  // @ts-ignore
  mapDispatchToProps
)(SearchResultsContainer);
