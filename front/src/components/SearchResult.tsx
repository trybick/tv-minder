import React from 'react';
import { Box, Heading } from '@chakra-ui/core';

const SearchResult = ({ show }: { show: any }) => (
  <Box p={3} mb={4} shadow="md" borderWidth="1px" >
    <Heading size="sm">{show.name}</Heading>
  </Box>
);

export default SearchResult;
