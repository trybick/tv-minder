import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import { fetchUserFollows } from 'store/follows/actions';
import Header from 'components/header/Header';
import SearchContainer from 'components/search/SearchContainer';
import { isLoggedIn } from 'utils/auth';

interface Props {
  preloadUserFollows: typeof fetchUserFollows;
}

const App = ({ preloadUserFollows }: Props): JSX.Element => {
  useEffect(() => {
    if (isLoggedIn) {
      preloadUserFollows();
    }
  }, [preloadUserFollows]);

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
  preloadUserFollows: () => dispatch(fetchUserFollows()),
});

export default connect(null, mapDispatchToProps)(App);
