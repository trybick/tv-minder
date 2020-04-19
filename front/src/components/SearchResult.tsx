import React from 'react';
import { Box, Flex, Heading, Tag, TagIcon, TagLabel } from '@chakra-ui/core';

const SearchResult = ({ show }: { show: any }) => (
  <Box p={3} mb={4} shadow="md" borderWidth="1px">
    <Flex justify="space-between">
      <Heading size="sm">{show.name}</Heading>
      <Tag size="md" variantColor="teal">
        <TagIcon icon="add" size="12px" />
        <TagLabel>Follow</TagLabel>
      </Tag>
    </Flex>
  </Box>
);

export default SearchResult;
