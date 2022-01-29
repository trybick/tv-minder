import { useEffect, useState } from 'react';
import { Badge, Box, Button, Flex, Grid, Heading, Image, Text, useToast } from '@chakra-ui/react';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';
import { AppThunkPlainAction } from 'store';
import { ID } from 'types/common';
import { ShowSearchResult } from 'types/external';
import { fallbackImagePath } from 'constants/strings';
import { localWarningToastMessage } from 'constants/toasts';

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
    poster_path: posterPath,
    vote_average: voteAverage,
  } = showToDisplay;
  const yearForDisplay = firstAirDate?.substr(0, 4);
  const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

  useEffect(() => {
    if (followedShows.includes(showId)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
    setIsLoading(false); // loading is set to true in follow functions
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
        <Box w="50px">
          <Image borderRadius="6px" fallbackSrc={fallbackImagePath} src={posterSource} />
        </Box>

        <Box minW="0">
          <Flex justify="space-between">
            <Heading mr="10px" size="md" isTruncated>
              {name}
            </Heading>

            {isFollowed ? (
              <Button
                bg="primary"
                color="white"
                isLoading={isLoading}
                leftIcon={<CheckIcon />}
                minW="102px"
                onClick={onUnFollowShow}
                size="sm"
                variant="solid"
              >
                Followed
              </Button>
            ) : (
              <Button
                colorScheme="cyan"
                isLoading={isLoading}
                leftIcon={<SmallAddIcon />}
                minW="88px"
                onClick={onFollowShow}
                size="sm"
                variant="outline"
              >
                Follow
              </Button>
            )}
          </Flex>

          <Flex mt="6px">
            <Text fontSize="14px">{yearForDisplay}</Text>

            {voteAverage ? (
              <Flex align="center" ml="10px">
                <Badge colorScheme="green" fontSize="12px" variant="outline">
                  {voteAverage}
                </Badge>
              </Flex>
            ) : (
              ''
            )}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default SearchResult;
