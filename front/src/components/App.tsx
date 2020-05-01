import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import { fetchUserFollows } from '../store/actions/getFollows';
import Header from 'components/header/Header';
import SearchContainer from 'components/search/SearchContainer';

interface Props {
  getFollows: typeof fetchUserFollows;
}

const App = ({ getFollows }: Props): JSX.Element => {
  useEffect(() => {
    getFollows();
  }, []);

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

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      getFollows: fetchUserFollows,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(App);
