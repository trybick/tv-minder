import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@chakra-ui/core';
import { requestBasicShowInfoAction } from 'store/tv/actions';

const MyShows = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestBasicShowInfoAction());
  }, []);

  return (
    <Box maxW="80%" m="30px auto 0">
      <Box></Box>
    </Box>
  );
};

export default MyShows;
