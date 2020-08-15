import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/core';
import { AppThunkPlainAction } from 'store';
import { ID } from 'types/common';
import { ShowSearchResult } from 'types/external';

interface Props {
  followedShows: ID[];
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  showToDisplay: ShowSearchResult;
  removeFromFollowedShows: (showId: number) => void;
  setHasLocalWarningToastBeenShown: AppThunkPlainAction;
  saveToFollowedShows: (showId: number) => void;
}

const SearchResult = ({
  followedShows,
  hasLocalWarningToastBeenShown,
  isLoggedIn,
  removeFromFollowedShows,
  saveToFollowedShows,
  setHasLocalWarningToastBeenShown,
  showToDisplay,
}: Props) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { first_air_date: firstAirDate, id: showId, name, popularity } = showToDisplay;
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const popularityForDisplay =
    popularity >= 10 && String(popularity)?.substr(0, 2).replace(/\.$/, '');

  useEffect(() => {
    if (followedShows.includes(showId)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [isLoggedIn, followedShows, showId]);

  function onFollowShow() {
    setIsLoading(true);
    saveToFollowedShows(showId);
    setIsLoading(false);

    if (!isLoggedIn && !hasLocalWarningToastBeenShown) {
      setHasLocalWarningToastBeenShown();
      toast({
        title: `Saving followed shows`,
        description: `Be sure to login to save permanently`,
        status: 'warning',
        duration: 7000,
        isClosable: true,
        position: 'bottom-right',
      });
    }
  }

  function onUnFollowShow() {
    setIsLoading(true);
    removeFromFollowedShows(showId);
    setIsLoading(false);
  }

  return (
    <Box p={3} mb={4} shadow="md" borderWidth="1px">
      <Flex justify="space-between">
        <Heading mr="10px" size="md" isTruncated>
          {name}
        </Heading>

        {isFollowed ? (
          <Button
            isLoading={isLoading}
            leftIcon="check"
            minW="88px"
            onClick={onUnFollowShow}
            size="sm"
            variant="solid"
            variantColor="teal"
          >
            Followed
          </Button>
        ) : (
          <Button
            isLoading={isLoading}
            leftIcon="small-add"
            minW="88px"
            onClick={onFollowShow}
            size="sm"
            variant="outline"
            variantColor="teal"
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
