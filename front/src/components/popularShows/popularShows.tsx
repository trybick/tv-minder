import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Heading, Stack, Text } from '@chakra-ui/core';
import { getPopularShowsAction } from 'store/tv/actions';
import { selectPopularShowsForDisplay } from 'store/tv/selectors';

const Show = () => (
  <Box borderWidth="1px" maxW={{ base: '100px', md: '200px' }} p={5} rounded="md" shadow="md">
    <Heading fontSize="xl">Show name</Heading>
    <Text mt={4}>Some text</Text>
  </Box>
);

const PopularShows = () => {
  const dispatch = useDispatch();
  const popularShows = useSelector(selectPopularShowsForDisplay);
  console.log('popularShows:', popularShows);

  useEffect(() => {
    dispatch(getPopularShowsAction());
  }, [dispatch]);

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
