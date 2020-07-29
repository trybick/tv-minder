import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@chakra-ui/core';
import { requestBasicShowInfoAction } from 'store/tv/actions';
import { selectBasicShowInfoForDisplay } from 'store/tv/selectors';

const MyShows = () => {
  const dispatch = useDispatch();
  const reselected = useSelector(selectBasicShowInfoForDisplay);
  console.log('reselected:', reselected);

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
