import React, { useState } from 'react';
import axios from 'axios';
import { Badge, Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/core';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';
import { isLoggedIn } from 'utils/auth';

interface Props {
  show: any;
  userFollows: any;
}

const SearchResult = ({ show, userFollows }: Props) => {
  const isInitiallyFollowed = isLoggedIn && userFollows.includes(String(show.id));
  const [isFollowed, setIsFollowed] = useState(isInitiallyFollowed);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  const { first_air_date: firstAirDate, id: externalId, name, popularity } = show;
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const popularityForDisplay =
    popularity >= 10 && String(popularity)?.substr(0, 2).replace(/\.$/, '');

  function onFollowShow() {
    setIsLoading(true);
    axios
      .post(
        `${baseUrl}/follow`,
        {
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
    axios
      .delete(`${baseUrl}/follow`, {
        data: {
          externalId,
          token: localStorage.getItem('jwt'),
        },
        timeout: 8000,
      })
      .then(() => {
        setIsLoading(false);
        setIsFollowed(false);
      })
      .catch((error) => {
        handleErrors(error);
        setIsLoading(false);
      });
  }

  // If a user is not signed in, we allow them to click Follow show and we save the shows locally
  // which are later retrieved during the sign up process
  function onLocalSaveShow() {
    saveShowToLocalStorage(externalId);
    setIsFollowed(true);

    // If this has not been shown before
    toast({
      title: `We'll keep track for now.`,
      description: `Be sure to login to save permenantly.`,
      status: 'warning',
      duration: 8000,
      isClosable: true,
      position: 'bottom-right',
    });
  }

  function onLocalUnsaveShow() {
    saveShowToLocalStorage(externalId, 'unsave');
    setIsFollowed(false);
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
            onClick={isLoggedIn ? onUnFollowShow : onLocalUnsaveShow}
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
            onClick={isLoggedIn ? onFollowShow : onLocalSaveShow}
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

function saveShowToLocalStorage(showId: any, method: 'save' | 'unsave' = 'save') {
  const key = 'savedShows';
  const existingShows = localStorage.getItem(key);
  const arrayToSave = existingShows ? JSON.parse(existingShows) : [];

  if (method === 'unsave') {
    const location = arrayToSave.indexOf(showId);
    if (location > -1) {
      arrayToSave.splice(location, 1);
    }
  } else {
    arrayToSave.push(showId);
  }

  localStorage.setItem(key, JSON.stringify(arrayToSave));
}
