import React from 'react';
import { Box, Stack, Tag } from '@chakra-ui/core';
import { connect, MapStateToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'store';
import {
  removeFromFollowedShowsAction,
  saveToFollowedShowsAction,
  setHasLocalWarningToastBeenShownAction,
  unregisteredRemoveFromFollowedShowsAction,
  unregisteredSaveToFollowedShowsAction,
} from 'store/user/actions';
import {
  selectFollowedShows,
  selectHasLocalWarningToastBeenShown,
  selectIsLoggedIn,
  selectUnregisteredFollowedShows,
} from 'store/user/reducers';
import { ID } from 'types/common';
import { ShowSearchResult } from 'types/external';
import SearchResult from './SearchResult';

interface OwnProps {
  shows: ShowSearchResult[];
  totalResults: number;
}

interface StateProps {
  followedShows: ID[];
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  unregisteredFollowedShows: ID[];
}

interface DispatchProps {
  removeFromFollowedShows: typeof removeFromFollowedShowsAction;
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
  saveToFollowedShows: typeof saveToFollowedShowsAction;
  unregisteredRemoveFromFollowedShows: typeof unregisteredRemoveFromFollowedShowsAction;
  unregisteredSaveToFollowedShows: typeof unregisteredSaveToFollowedShowsAction;
}

type Props = OwnProps & StateProps & DispatchProps;

const SearchResults = ({
  followedShows,
  hasLocalWarningToastBeenShown,
  isLoggedIn,
  removeFromFollowedShows,
  saveToFollowedShows,
  setHasLocalWarningToastBeenShown,
  shows,
  totalResults,
  unregisteredFollowedShows,
  unregisteredRemoveFromFollowedShows,
  unregisteredSaveToFollowedShows,
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
            followedShows={followedShows}
            hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
            isLoggedIn={isLoggedIn}
            key={show.id}
            removeFromFollowedShows={removeFromFollowedShows}
            saveToFollowedShows={saveToFollowedShows}
            setHasLocalWarningToastBeenShown={setHasLocalWarningToastBeenShown}
            showToDisplay={show}
            unregisteredFollowedShows={unregisteredFollowedShows}
            unregisteredRemoveFromFollowedShows={unregisteredRemoveFromFollowedShows}
            unregisteredSaveToFollowedShows={unregisteredSaveToFollowedShows}
          />
        ))}
      </Stack>
    </Box>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState) => ({
  followedShows: selectFollowedShows(state),
  hasLocalWarningToastBeenShown: selectHasLocalWarningToastBeenShown(state),
  isLoggedIn: selectIsLoggedIn(state),
  unregisteredFollowedShows: selectUnregisteredFollowedShows(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, void, any>) => ({
  removeFromFollowedShows: (showId: string) => dispatch(removeFromFollowedShowsAction(showId)),
  saveToFollowedShows: (showId: string) => dispatch(saveToFollowedShowsAction(showId)),
  setHasLocalWarningToastBeenShown: () => dispatch(setHasLocalWarningToastBeenShownAction()),
  unregisteredRemoveFromFollowedShows: (showId: string) =>
    dispatch(unregisteredRemoveFromFollowedShowsAction(showId)),
  unregisteredSaveToFollowedShows: (showId: string) =>
    dispatch(unregisteredSaveToFollowedShowsAction(showId)),
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults);
