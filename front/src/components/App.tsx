import React, { useEffect } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import { AppState } from 'store';
import { fetchUserFollowsAction } from 'store/user/actions';
import Header from 'components/header/Header';
import SearchPage from 'components/search/SearchPage';

interface StateProps {
  isLoggedIn: boolean;
}

interface DispatchProps {
  fetchUserFollows: typeof fetchUserFollowsAction;
}

type Props = StateProps & DispatchProps;

const App = ({ isLoggedIn, fetchUserFollows }: Props): JSX.Element => {
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserFollows();
    }
  }, [isLoggedIn, fetchUserFollows]);

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
  isLoggedIn: state.userReducer.isLoggedIn,
});

const mapDispatchToProps = (dispatch: any) => ({
  fetchUserFollows: () => dispatch(fetchUserFollowsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
