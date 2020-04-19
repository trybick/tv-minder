import React from 'react';
import { Box } from '@chakra-ui/core';
import Header from './Header';
import SearchContainer from './SearchContainer';

const App = (): JSX.Element => (
  <Box>
    <Header />
    <SearchContainer />
  </Box>
);

export default App;
