import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge, Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/core';
import {
  followShowAction,
  unregisteredFollowShowAction,
  setHasLocalWarningToastBeenShownAction,
  unFollowShowAction,
  unregisteredUnFollowShowAction,
} from 'store/user/actions';
import { baseUrl } from 'utils/constants';
import handleErrors from 'utils/handleErrors';

interface Props {
  followedShows: any;
  followedShowsForUnregisteredUser: any;
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  showToDisplay: any;
  followShow: typeof followShowAction;
  unregisteredFollowShow: typeof unregisteredFollowShowAction;
  setHasLocalWarningToastBeenShown: typeof setHasLocalWarningToastBeenShownAction;
  unFollowShow: typeof unFollowShowAction;
  unregisteredUnFollowShow: typeof unregisteredUnFollowShowAction;
}

const SearchResult = ({
  followShow,
  followedShows,
  followedShowsForUnregisteredUser,
  unregisteredFollowShow,
  hasLocalWarningToastBeenShown,
  isLoggedIn,
  setHasLocalWarningToastBeenShown,
  showToDisplay,
  unFollowShow,
  unregisteredUnFollowShow,
}: Props) => {
  // State
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  // Display
  const { first_air_date: firstAirDate, id, name, popularity } = showToDisplay;
  const showId = String(id);
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const popularityForDisplay =
    popularity >= 10 && String(popularity)?.substr(0, 2).replace(/\.$/, '');

  useEffect(() => {
    const loggedInIsFollowed = followedShows.includes(showId);
    const unregisteredIsFollowed = followedShowsForUnregisteredUser.includes(showId);

    if (isLoggedIn) {
      loggedInIsFollowed ? setIsFollowed(true) : setIsFollowed(false);
    } else {
      unregisteredIsFollowed ? setIsFollowed(true) : setIsFollowed(false);
    }
  }, [isLoggedIn, followedShows, followedShowsForUnregisteredUser, showId]);

  function onFollowShow() {
    setIsLoading(true);
    axios
      .post(
        `${baseUrl}/follow`,
        {
          showId,
          token: localStorage.getItem('jwt'),
        },
        { timeout: 8000 }
      )
      .then(() => {
        setIsLoading(false);
        followShow(showId);
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
          showId,
          token: localStorage.getItem('jwt'),
        },
        timeout: 8000,
      })
      .then(() => {
        setIsLoading(false);
        unFollowShow(showId);
      })
      .catch((error) => {
        handleErrors(error);
        setIsLoading(false);
      });
  }

  function onLocalSaveShow() {
    unregisteredFollowShow(showId);

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
    unregisteredUnFollowShow(showId);
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
