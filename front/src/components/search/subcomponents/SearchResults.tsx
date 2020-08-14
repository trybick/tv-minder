import React from 'react';
import { Box, Stack, Tag } from '@chakra-ui/core';
import { connect, MapStateToProps } from 'react-redux';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import {
  removeFromFollowedShowsAction,
  saveToFollowedShowsAction,
  setHasLocalWarningToastBeenShownAction,
} from 'store/user/actions';
import {
  selectFollowedShows,
  selectHasLocalWarningToastBeenShown,
  selectIsLoggedIn,
} from 'store/user/selectors';
import { ID } from 'types/common';
import { ShowSearchResult } from 'types/external';
import { maybePluralize } from 'utils/formatting';
import SearchResult from './SearchResult';

interface OwnProps {
  shows: ShowSearchResult[];
  totalResults: number;
}

interface StateProps {
  followedShows: ID[];
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
}

interface DispatchProps {
  removeFromFollowedShows: (showId: number) => void;
  setHasLocalWarningToastBeenShown: AppThunkPlainAction;
  saveToFollowedShows: (showId: number) => void;
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
}: Props) => {
  const totalMatchesText = `${totalResults} ${maybePluralize(totalResults, 'match', 'es')} found`;

  return (
    <Box>
      <Box textAlign="right">
        <Tag size="sm" mb="24px" fontSize="0.84rem">
          {totalMatchesText}
        </Tag>
      </Box>

      <Stack w={['xs', 'sm', 'md', 'lg']} spacing={4}>
        {shows.map(show => (
          <SearchResult
            followedShows={followedShows}
            hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
            isLoggedIn={isLoggedIn}
            key={show.id}
            removeFromFollowedShows={removeFromFollowedShows}
            saveToFollowedShows={saveToFollowedShows}
            setHasLocalWarningToastBeenShown={setHasLocalWarningToastBeenShown}
            showToDisplay={show}
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
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  removeFromFollowedShows: (showId: number) => dispatch(removeFromFollowedShowsAction(showId)),
  saveToFollowedShows: (showId: number) => dispatch(saveToFollowedShowsAction(showId)),
  setHasLocalWarningToastBeenShown: () => dispatch(setHasLocalWarningToastBeenShownAction()),
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults);
