import React, { useState } from 'react';
import axios from 'axios';
import { Badge, Box, Button, Flex, Heading, Text } from '@chakra-ui/core';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';

const SearchResult = ({ show, userFollows }: { show: any; userFollows: any }) => {
  const { first_air_date: firstAirDate, id: externalId, name, popularity } = show;
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const popularityForDisplay =
    popularity >= 10 && String(popularity)?.substr(0, 2).replace(/\.$/, '');

  const isInitiallyFollowed = userFollows.includes(String(show.id));
  const [isFollowed, setIsFollowed] = useState(isInitiallyFollowed);
  const [isLoading, setIsLoading] = React.useState(false);

  function onFollowShow() {
    setIsLoading(true);
    axios
      .post(
        `${baseUrl}/follow`,
        {
          name,
          externalId,
          token: localStorage.getItem('jwt'),
        },
        { timeout: 8000 }
      )
      .then(() => {
        setIsLoading(false);
        setIsFollowed(true);
      })
      .catch((error) => {
        handleErrors(error);
        setIsLoading(false);
      });
  }

  function onUnFollowShow() {
    setIsLoading(true);
    axios({
      method: 'delete',
      url: `${baseUrl}/follow`,
      data: {
        name,
        externalId,
        token: localStorage.getItem('jwt'),
      },
    })
      .then(() => {
        setIsLoading(false);
        setIsFollowed(false);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  return (
    <Box p={3} mb={4} shadow="md" borderWidth="1px">
      <Flex justify="space-between">
        <Flex align="center">
          <Heading size="md" isTruncated>
            {name}
          </Heading>
        </Flex>
        {isFollowed ? (
          <Button
            minW="88px"
            size="sm"
            leftIcon="check"
            variantColor="teal"
            variant="solid"
            onClick={onUnFollowShow}
            isLoading={isLoading}
          >
            Followed
          </Button>
        ) : (
          <Button
            minW="88px"
            size="sm"
            leftIcon="small-add"
            variantColor="teal"
            variant="outline"
            onClick={onFollowShow}
            isLoading={isLoading}
          >
            Follow
          </Button>
        )}
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
