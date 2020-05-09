import React from 'react';
import { Box, Stack, Tag } from '@chakra-ui/core';
import { connect, MapStateToProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from 'store';
import {
  saveToFollowedShowsAction,
  unregisteredFollowShowAction,
  setHasLocalWarningToastBeenShownAction,
  removeFromFollowedShowsAction,
  unregisteredUnFollowShowAction,
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
  unregisteredFollowShow: typeof unregisteredFollowShowAction;
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
  removeFromFollowedShows: typeof removeFromFollowedShowsAction;
  unregisteredUnFollowShow: typeof unregisteredUnFollowShowAction;
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
  unregisteredFollowShow,
  removeFromFollowedShows,
  unregisteredUnFollowShow,
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
            unregisteredFollowShow={unregisteredFollowShow}
            hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
            isLoggedIn={isLoggedIn}
            key={show.id}
            setHasLocalWarningToastBeenShown={setHasLocalWarningToastBeenShown}
            showToDisplay={show}
            followedShows={followedShows}
            removeFromFollowedShows={removeFromFollowedShows}
            unregisteredUnFollowShow={unregisteredUnFollowShow}
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
  unregisteredFollowShow: (showId: string) => dispatch(unregisteredFollowShowAction(showId)),
  setHasLocalWarningToastBeenShown: () => dispatch(setHasLocalWarningToastBeenShownAction()),
  unregisteredUnFollowShow: (showId: string) => dispatch(unregisteredUnFollowShowAction(showId)),
  removeFromFollowedShows: (showId: string) => dispatch(removeFromFollowedShowsAction(showId)),
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SearchResults);
