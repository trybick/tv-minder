import React from 'react';
import { connect } from 'react-redux';
import { Box, Flex, Spinner, Stack, Tag, Text } from '@chakra-ui/core';
import SearchResult from './SearchResult';

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

const SearchResults = ({
  shows,
  totalResults,
  userFollows,
}: Pick<Props, 'shows' | 'totalResults' | 'userFollows'>) => {
  const casedMatches = totalResults === 1 ? 'match' : 'matches';
  const totalMatchesText = `${totalResults} ${casedMatches} found`;

  return (
    <Box>
      <Box textAlign="right">
        <Tag size="sm" mb="24px" fontSize="0.84rem">
          {totalMatchesText}
        </Tag>
      </Box>
      <Stack w={['xs', 'sm', 'md', 'lg']} spacing={4}>
        {shows.map((show) => (
          <SearchResult key={show.id} show={show} userFollows={userFollows} />
        ))}
      </Stack>
    </Box>
  );
};

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
  userFollows: state.userFollows,
});

export default connect(mapStateToProps, null)(SearchResultsContainer);
