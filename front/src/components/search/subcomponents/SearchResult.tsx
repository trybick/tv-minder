import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/core';
import {
  followShowForUnregisteredUserAction,
  setHasLocalWarningToastBeenShownAction,
  unFollowShowForUnregisteredUserAction,
} from 'store/user/actions';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';

interface Props {
  followedShows: any;
  followedShowsForUnregisteredUser: any;
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  showToDisplay: any;
  followShowForUnregisteredUser: typeof followShowForUnregisteredUserAction;
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
  unFollowShowForUnregisteredUser: typeof unFollowShowForUnregisteredUserAction;
}

const SearchResult = ({
  followedShows,
  followedShowsForUnregisteredUser,
  followShowForUnregisteredUser,
  hasLocalWarningToastBeenShown,
  isLoggedIn,
  setHasLocalWarningToastBeenShown,
  showToDisplay,
  unFollowShowForUnregisteredUser,
}: Props) => {
  useEffect(() => {
    const loggedInIsFollowed = followedShows.includes(showToDisplay.id);
    const unregisteredIsFollowed = followedShowsForUnregisteredUser.includes(showToDisplay.id);

    if (isLoggedIn) {
      loggedInIsFollowed ? setIsFollowed(true) : setIsFollowed(false);
    } else {
      unregisteredIsFollowed ? setIsFollowed(true) : setIsFollowed(false);
    }
  }, [isLoggedIn, followedShows, followedShowsForUnregisteredUser]);

  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();
  const { first_air_date: firstAirDate, id: externalId, name, popularity } = showToDisplay;
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

  function onLocalSaveShow() {
    followShowForUnregisteredUser(externalId);

    if (!hasLocalWarningToastBeenShown) {
      setHasLocalWarningToastBeenShown();
      toast({
        title: `Saving followed shows`,
        description: `Be sure to login to save permanently`,
        status: 'warning',
        duration: 8000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  }

  function onLocalUnsaveShow() {
    unFollowShowForUnregisteredUser(externalId);
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
