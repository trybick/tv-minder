import React from 'react';
import { Badge, Box, Flex, Heading, Tag, TagIcon, TagLabel, Text } from '@chakra-ui/core';

const SearchResult = ({ show }: { show: any }) => {
  const { first_air_date: firstAirDate, name, vote_average: voteAverage } = show;
  const year = firstAirDate?.substr(0, 4);

  return (
    <Box p={3} mb={4} shadow="md" borderWidth="1px">
      <Flex justify="space-between">
        <Flex>
          <Heading size="sm" isTruncated>
            {name}
          </Heading>
          {!!voteAverage && (
            <Flex ml="6px" align="center">
              <Badge>{voteAverage}</Badge>
            </Flex>
          )}
        </Flex>
        <Tag size="sm" variantColor="teal">
          <TagIcon icon="add" size="12px" />
          <TagLabel>Follow</TagLabel>
        </Tag>
      </Flex>
      <Text fontSize="12px">{year}</Text>
    </Box>
  );
};

export default SearchResult;
