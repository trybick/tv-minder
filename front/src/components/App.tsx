import React from 'react';
import { Box } from '@chakra-ui/core';
import Header from './Header';
import SearchContainer from './search/SearchContainer';

const App = (): JSX.Element => (
  <Box bg="white">
    <Header />
    <SearchContainer />
  </Box>
);

export default App;
