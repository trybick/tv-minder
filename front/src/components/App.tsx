import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import Header from 'components/Header';
import SearchContainer from 'components/search/SearchContainer';

const App = (): JSX.Element => (
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

export default App;
