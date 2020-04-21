import React from 'react';
import { Badge, Box, Button, Flex, Heading, Text } from '@chakra-ui/core';

const SearchResult = ({ show }: { show: any }) => {
  const { first_air_date: firstAirDate, name, popularity } = show;
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const popularityForDisplay = String(popularity)?.substr(0, 2).replace(/\.$/, '');

  return (
    <Box p={3} mb={4} shadow="md" borderWidth="1px">
      <Flex justify="space-between">
        <Flex align="center">
          <Heading size="md" isTruncated>
            {name}
          </Heading>
        </Flex>
        <Button size="sm" leftIcon="small-add" variantColor="teal" variant="outline">
          Follow
        </Button>
      </Flex>
      <Flex mt="4px">
        <Badge variant="subtle">{yearForDisplay}</Badge>
        {!!popularity && (
          <Flex ml="6px" align="center">
            <Badge variant="subtle" color="green.400">
              {popularityForDisplay}% watching now
            </Badge>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default SearchResult;
