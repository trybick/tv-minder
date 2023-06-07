import { Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Grid, Heading, Image, Link, Text } from '@chakra-ui/react';
import { AppThunkPlainAction } from 'store';
import { ID } from 'types/common';
import { ShowSearchResult } from 'types/external';
import { ROUTES } from 'constants/routes';
import { fallbackImagePath } from 'constants/strings';
import FollowButton from 'components/common/FollowButton';

type Props = {
  followedShows: ID[];
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  showToDisplay: ShowSearchResult;
  removeFromFollowedShows: (showId: ID) => void;
  setHasLocalWarningToastBeenShown: AppThunkPlainAction;
  saveToFollowedShows: (showId: ID) => void;
};

const SearchResult = ({ showToDisplay }: Props) => {
  const {
    first_air_date: firstAirDate,
    id: showId,
    name,
    overview,
    poster_path: posterPath,
  } = showToDisplay;
  const yearForDisplay = firstAirDate?.substring(0, 4);
  const posterSource = posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

  return (
    <Box borderRadius="6px" borderWidth="1px" p="14px" shadow="md">
      <Grid gap={4} templateColumns="100px 1fr">
        <Box w="100px">
          <Link as={RouterLink} to={`${ROUTES.SHOW}/${showId}`}>
            <Image
              borderRadius="6px"
              fallbackSrc={fallbackImagePath}
              fallbackStrategy="onError"
              src={posterSource || fallbackImagePath}
            />
          </Link>
        </Box>

        <Flex direction="column" justifyContent="space-evenly" minW="0">
          <Flex w="100%">
            <Box>
              <Link as={RouterLink} minW="0" to={`${ROUTES.SHOW}/${showId}`}>
                <Heading alignSelf="center" mr="10px" noOfLines={2} size="md">
                  {name}
                </Heading>
              </Link>
              <Text fontSize="15px" fontWeight="400" mt="2px">
                {yearForDisplay}
              </Text>
            </Box>
            <FollowButton
              followedWidth="110px"
              ml="auto"
              showId={showId}
              size="sm"
              unfollowedWidth="91px"
            />
          </Flex>

          <Text fontSize="14px" mt="8px" noOfLines={3}>
            {overview}
          </Text>
        </Flex>
      </Grid>
    </Box>
  );
};

export default SearchResult;
