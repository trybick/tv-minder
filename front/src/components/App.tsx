import React from 'react';
import { Box } from '@chakra-ui/core';
import Header from './Header';
import SearchField from './SearchField';

const App = (): JSX.Element => (
  <Box>
    <Header />
    <SearchField />
  </Box>
);

export default App;
