import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  IToast,
  Text,
  useToast,
} from '@chakra-ui/core';
import { AppThunkPlainAction } from 'store';
import { ID } from 'types/common';
import { ShowSearchResult } from 'types/external';
import { fallbackImage } from 'utils/constants';

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

  const {
    first_air_date: firstAirDate,
    id: showId,
    name,
    popularity,
    poster_path: posterPath,
  } = showToDisplay;
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const popularityForDisplay =
    popularity >= 10 && String(popularity)?.substr(0, 2).replace(/\.$/, '');
  const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

  const localWarningToastMessage: IToast = {
    title: 'Temporarily saving',
    description: 'Be sure to sign up to save permanently',
    status: 'warning',
    duration: 7000,
    isClosable: true,
    position: window.innerWidth > 767 ? 'bottom-right' : 'bottom',
  };

  useEffect(() => {
    if (followedShows.includes(showId)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }

    // Set loading to false because it's set to true in the onFollow functions
    setIsLoading(false);
  }, [isLoggedIn, followedShows, showId]);

  function onFollowShow() {
    setIsLoading(true);
    saveToFollowedShows(showId);

    if (!isLoggedIn && !hasLocalWarningToastBeenShown) {
      setHasLocalWarningToastBeenShown();
      toast(localWarningToastMessage);
    }
  }

  function onUnFollowShow() {
    setIsLoading(true);
    removeFromFollowedShows(showId);
  }

  return (
    <Box borderWidth="1px" mb={4} p={3} shadow="md">
      <Grid alignItems="center" gap={6} templateColumns="50px 1fr">
        <Box width="50px">
          <Image borderRadius="6px" fallbackSrc={fallbackImage} src={posterSource} />
        </Box>

        <Box minW="0">
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
                variantColor="cyan"
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
                variantColor="cyan"
              >
                Follow
              </Button>
            )}
          </Flex>

          <Flex mt="6px">
            <Text fontSize=".9rem">{yearForDisplay}</Text>

            {popularityForDisplay && (
              <Flex align="center" ml="10px">
                <Badge color="green.400" variant="subtle">
                  {popularityForDisplay}% watching now
                </Badge>
              </Flex>
            )}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default SearchResult;
