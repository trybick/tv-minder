import React from 'react';
import { Badge, Box, Button, Flex, Heading, Text } from '@chakra-ui/core';

const SearchResult = ({ show }: { show: any }) => {
  const { first_air_date: firstAirDate, id: externalId, name, popularity } = show;
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const popularityForDisplay =
    popularity >= 10 && String(popularity)?.substr(0, 2).replace(/\.$/, '');

  function onFollowShow() {
    console.log('id', externalId, 'name', name);
  }

  return (
    <Box p={3} mb={4} shadow="md" borderWidth="1px">
      <Flex justify="space-between">
        <Flex align="center">
          <Heading size="md" isTruncated>
            {name}
          </Heading>
        </Flex>
        <Button
          size="sm"
          leftIcon="small-add"
          variantColor="teal"
          variant="outline"
          onClick={onFollowShow}
        >
          Follow
        </Button>
      </Flex>
      <Flex mt="6px">
        <Text fontSize=".83rem">{yearForDisplay}</Text>
        {popularityForDisplay && (
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
