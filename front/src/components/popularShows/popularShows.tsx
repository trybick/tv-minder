import React from 'react';
import { Box, Heading, Stack, Text } from '@chakra-ui/core';

// useEffect to call a getPopularShows action
// which calls the Popular Shows api method
// which updates state for a selector which is fed to the component

const Show = () => (
  <Box borderWidth="1px" maxW={{ base: '100px', md: '200px' }} p={5} rounded="md" shadow="md">
    <Heading fontSize="xl">Show name</Heading>
    <Text mt={4}>Some text</Text>
  </Box>
);

const PopularShows = () => {
  return (
    <Box m="0 auto" maxWidth="60%" textAlign="center">
      <Stack align="center" spacing={8} isInline>
        <Show />
        <Show />
      </Stack>
    </Box>
  );
};

export default PopularShows;
