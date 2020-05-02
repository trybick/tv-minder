import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import { fetchUserFollows as fetchUserFollowsAction } from 'store/follows/actions';
import Header from 'components/header/Header';
import SearchContainer from 'components/search/SearchContainer';

interface Props {
  fetchUserFollows: typeof fetchUserFollowsAction;
}

const App = ({ fetchUserFollows }: Props): JSX.Element => {
  useEffect(() => {
    fetchUserFollows();
  }, [fetchUserFollows]);

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <SearchContainer />
        </Route>
        <Route path="/calendar">
          <Box>Calendar</Box>
        </Route>
      </Switch>
    </Router>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  fetchUserFollows: () => dispatch(fetchUserFollowsAction()),
});

export default connect(null, mapDispatchToProps)(App);
