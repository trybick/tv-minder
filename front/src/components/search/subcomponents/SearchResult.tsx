import { Badge, Box, Flex, Grid, Heading, Image, Text } from '@chakra-ui/react';
import { AppThunkPlainAction } from 'store';
import { ID } from 'types/common';
import { ShowSearchResult } from 'types/external';
import { fallbackImagePath } from 'constants/strings';
import FollowButton from './FollowButton';

interface Props {
  followedShows: ID[];
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  showToDisplay: ShowSearchResult;
  removeFromFollowedShows: (showId: number) => void;
  setHasLocalWarningToastBeenShown: AppThunkPlainAction;
  saveToFollowedShows: (showId: number) => void;
}

const SearchResult = ({ showToDisplay }: Props) => {
  const {
    first_air_date: firstAirDate,
    id: showId,
    name,
    poster_path: posterPath,
    vote_average: voteAverage,
  } = showToDisplay;
  const yearForDisplay = firstAirDate?.substring(0, 4);
  const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

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
            <FollowButton showId={showId} />
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
