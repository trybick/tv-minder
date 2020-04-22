import React from 'react';
import { Box } from '@chakra-ui/core';
import Header from 'components/Header';
import SearchContainer from 'components/search/SearchContainer';

const App = (): JSX.Element => (
  <Box bg="white">
    <Header />
    <SearchContainer />
  </Box>
);

export default App;
