import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/core';

const Header = (): JSX.Element => (
  <Flex justify="space-between" bg="grey" color="white">
    <Box p={4}>
      <Text fontSize="lg">TV Minder</Text>
    </Box>
    <Flex align="center">
      <Button size="sm" variantColor="teal">
        Login
      </Button>
      <Button size="sm" variantColor="teal" mx={4}>
        Register
      </Button>
    </Flex>
  </Flex>
);

export default Header;
