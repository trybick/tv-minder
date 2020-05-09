import React from 'react';
import { Box, Stack, Tag } from '@chakra-ui/core';
import { connect, MapStateToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'store';
import {
  followShowForUnregisteredUserAction,
  setHasLocalWarningToastBeenShownAction,
  unFollowShowForUnregisteredUserAction,
} from 'store/user/actions';
import SearchResult from './SearchResult';

interface OwnProps {
  shows: any[];
  totalResults: number;
}

interface StateProps {
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  followedShows?: any[];
}

interface DispatchProps {
  followShowForUnregisteredUser: typeof followShowForUnregisteredUserAction;
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
  unFollowShowForUnregisteredUser: typeof unFollowShowForUnregisteredUserAction;
}

type Props = OwnProps & StateProps & DispatchProps;

const SearchResults = ({
  hasLocalWarningToastBeenShown,
  isLoggedIn,
  setHasLocalWarningToastBeenShown,
  shows,
  totalResults,
  followedShows,
  followShowForUnregisteredUser,
  unFollowShowForUnregisteredUser,
}: Props) => {
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
          <SearchResult
            followShowForUnregisteredUser={followShowForUnregisteredUser}
            hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
            isLoggedIn={isLoggedIn}
            key={show.id}
            setHasLocalWarningToastBeenShown={setHasLocalWarningToastBeenShown}
            showToDisplay={show}
            followedShows={followedShows}
            unFollowShowForUnregisteredUser={unFollowShowForUnregisteredUser}
          />
        ))}
      </Stack>
    </Box>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState) => ({
  hasLocalWarningToastBeenShown: state.user.hasLocalWarningToastBeenShown,
  isLoggedIn: state.user.isLoggedIn,
  followedShows: state.user.followedShows,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, any>) => ({
  setHasLocalWarningToastBeenShown: () => dispatch(setHasLocalWarningToastBeenShownAction()),
  followShowForUnregisteredUser: (showId: number) =>
    dispatch(followShowForUnregisteredUserAction(showId)),
  unFollowShowForUnregisteredUser: (showId: number) =>
    dispatch(unFollowShowForUnregisteredUserAction(showId)),
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults);
