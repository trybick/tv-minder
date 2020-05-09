import React from 'react';
import { Box, Stack, Tag } from '@chakra-ui/core';
import { connect, MapStateToProps } from 'react-redux';
import { AppState } from 'store';
import SearchResult from './SearchResult';

interface OwnProps {
  shows: any[];
  totalResults: number;
}

interface StateProps {
  userFollows?: any[];
}

type Props = OwnProps & StateProps;

const SearchResults = ({ shows, totalResults, userFollows }: Props) => {
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

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState) => ({
  userFollows: state.user.userFollows,
});

export default connect<StateProps, null, OwnProps, AppState>(mapStateToProps, null)(SearchResults);
