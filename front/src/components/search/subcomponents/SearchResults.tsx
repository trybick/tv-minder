import React from 'react';
import { Box, Stack, Tag } from '@chakra-ui/core';
import { connect, MapStateToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'store';
import {
  saveToFollowedShowsAction,
  unregisteredSaveToFollowedShowsAction,
  setHasLocalWarningToastBeenShownAction,
  removeFromFollowedShowsAction,
  unregisteredRemoveFromFollowedShowsAction,
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
  unregisteredFollowedShows?: any[];
}

interface DispatchProps {
  saveToFollowedShows: typeof saveToFollowedShowsAction;
  unregisteredSaveToFollowedShows: typeof unregisteredSaveToFollowedShowsAction;
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
  removeFromFollowedShows: typeof removeFromFollowedShowsAction;
  unregisteredRemoveFromFollowedShows: typeof unregisteredRemoveFromFollowedShowsAction;
}

type Props = OwnProps & StateProps & DispatchProps;

const SearchResults = ({
  saveToFollowedShows,
  unregisteredFollowedShows,
  hasLocalWarningToastBeenShown,
  isLoggedIn,
  setHasLocalWarningToastBeenShown,
  shows,
  totalResults,
  followedShows,
  unregisteredSaveToFollowedShows,
  removeFromFollowedShows,
  unregisteredRemoveFromFollowedShows,
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
            saveToFollowedShows={saveToFollowedShows}
            unregisteredFollowedShows={unregisteredFollowedShows}
            unregisteredSaveToFollowedShows={unregisteredSaveToFollowedShows}
            hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
            isLoggedIn={isLoggedIn}
            key={show.id}
            setHasLocalWarningToastBeenShown={setHasLocalWarningToastBeenShown}
            showToDisplay={show}
            followedShows={followedShows}
            removeFromFollowedShows={removeFromFollowedShows}
            unregisteredRemoveFromFollowedShows={unregisteredRemoveFromFollowedShows}
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
  unregisteredFollowedShows: state.user.unregisteredFollowedShows,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, any>) => ({
  saveToFollowedShows: (showId: string) => dispatch(saveToFollowedShowsAction(showId)),
  unregisteredSaveToFollowedShows: (showId: string) =>
    dispatch(unregisteredSaveToFollowedShowsAction(showId)),
  setHasLocalWarningToastBeenShown: () => dispatch(setHasLocalWarningToastBeenShownAction()),
  unregisteredRemoveFromFollowedShows: (showId: string) =>
    dispatch(unregisteredRemoveFromFollowedShowsAction(showId)),
  removeFromFollowedShows: (showId: string) => dispatch(removeFromFollowedShowsAction(showId)),
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults);
