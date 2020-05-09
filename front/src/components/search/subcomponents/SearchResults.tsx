import React from 'react';
import { Box, Stack, Tag } from '@chakra-ui/core';
import { connect, MapStateToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'store';
import {
  followShowAction,
  followShowForUnregisteredUserAction,
  setHasLocalWarningToastBeenShownAction,
  unFollowShowAction,
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
  followedShowsForUnregisteredUser?: any[];
}

interface DispatchProps {
  followShow: typeof followShowAction;
  followShowForUnregisteredUser: typeof followShowForUnregisteredUserAction;
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
  unFollowShow: typeof unFollowShowAction;
  unFollowShowForUnregisteredUser: typeof unFollowShowForUnregisteredUserAction;
}

type Props = OwnProps & StateProps & DispatchProps;

const SearchResults = ({
  followShow,
  followedShowsForUnregisteredUser,
  hasLocalWarningToastBeenShown,
  isLoggedIn,
  setHasLocalWarningToastBeenShown,
  shows,
  totalResults,
  followedShows,
  followShowForUnregisteredUser,
  unFollowShow,
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
            followShow={followShow}
            followedShowsForUnregisteredUser={followedShowsForUnregisteredUser}
            followShowForUnregisteredUser={followShowForUnregisteredUser}
            hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
            isLoggedIn={isLoggedIn}
            key={show.id}
            setHasLocalWarningToastBeenShown={setHasLocalWarningToastBeenShown}
            showToDisplay={show}
            followedShows={followedShows}
            unFollowShow={unFollowShow}
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
  followedShowsForUnregisteredUser: state.user.followedShowsForUnregisteredUser,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, any>) => ({
  followShow: (showId: string) => dispatch(followShowAction(showId)),
  followShowForUnregisteredUser: (showId: string) =>
    dispatch(followShowForUnregisteredUserAction(showId)),
  setHasLocalWarningToastBeenShown: () => dispatch(setHasLocalWarningToastBeenShownAction()),
  unFollowShowForUnregisteredUser: (showId: string) =>
    dispatch(unFollowShowForUnregisteredUserAction(showId)),
  unFollowShow: (showId: string) => dispatch(unFollowShowAction(showId)),
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults);
