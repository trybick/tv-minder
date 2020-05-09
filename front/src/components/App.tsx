import React, { useEffect } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import { AppState } from 'store';
import { fetchfollowedShowsAction } from 'store/user/actions';
import Header from 'components/header/Header';
import SearchPage from 'components/search/SearchPage';

interface StateProps {
  isLoggedIn: boolean;
}

interface DispatchProps {
  fetchfollowedShows: typeof fetchfollowedShowsAction;
}

type Props = StateProps & DispatchProps;

const App = ({ isLoggedIn, fetchfollowedShows }: Props): JSX.Element => {
  useEffect(() => {
    if (isLoggedIn) {
      fetchfollowedShows();
    }
  }, [isLoggedIn, fetchfollowedShows]);

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <SearchPage />
        </Route>
        <Route path="/calendar">
          <Box>Calendar</Box>
        </Route>
      </Switch>
    </Router>
  );
};

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (
  state: AppState
): StateProps => ({
  isLoggedIn: state.user.isLoggedIn,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchfollowedShows: () => dispatch(fetchfollowedShowsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
