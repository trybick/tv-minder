import React from 'react';
import { Box, Grid, Link, Text } from '@chakra-ui/core';
import { FaGithub } from 'react-icons/fa';

const Footer = () => (
  <Box backgroundColor="#F3F5F6" marginTop="30px" height="72px" padding=".5rem">
    <Grid
      alignItems="center"
      fontSize=".85rem"
      justifyContent="space-between"
      min-height="72px"
      padding="1rem 2rem"
      templateColumns="repeat(auto-fit, minmax(200px,240px))"
    >
      <Box color="#333" fontWeight="700">
        <Link href="https://github.com/trybick/tv-minder" isExternal>
          <Box as={FaGithub} display="inline" mr="4px" size="16px" verticalAlign="sub" />
          <Text display="inline">GitHub</Text>
        </Link>
      </Box>

      <Box color="#a0a4a6" textAlign="right">
        © {new Date().getFullYear()}
        {` `}
        <Text display="inline">TV-Minder</Text>
      </Box>
    </Grid>
  </Box>
);

export default Footer;
