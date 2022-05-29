import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Grid, Heading, Image, Link, Text } from '@chakra-ui/react';
import { AppThunkPlainAction } from 'store';
import { ID } from 'types/common';
import { ShowSearchResult } from 'types/external';
import { ROUTES } from 'constants/routes';
import { fallbackImagePath } from 'constants/strings';
import FollowButton from 'components/common/FollowButton';

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
  const { first_air_date: firstAirDate, id: showId, name, poster_path: posterPath } = showToDisplay;
  const yearForDisplay = firstAirDate?.substring(0, 4);
  const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

  return (
    <Box borderWidth="1px" mb={4} p={3} shadow="md">
      <Grid alignItems="center" gap={6} templateColumns="50px 1fr">
        <Box w="50px">
          <Link as={RouterLink} to={`${ROUTES.SHOW}/${showId}`}>
            <Image borderRadius="6px" fallbackSrc={fallbackImagePath} src={posterSource} />
          </Link>
        </Box>

        <Box minW="0">
          <Flex justify="space-between">
            <Link as={RouterLink} minW="0" to={`${ROUTES.SHOW}/${showId}`}>
              <Heading mr="10px" noOfLines={1} size="md">
                {name}
              </Heading>
            </Link>
            <FollowButton minW="91px" showId={showId} size="sm" />
          </Flex>

          <Flex mt="6px">
            <Text fontSize="14px">{yearForDisplay}</Text>
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
};

export default SearchResult;
