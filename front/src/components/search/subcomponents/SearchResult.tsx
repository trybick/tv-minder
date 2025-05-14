import { Box, Flex, Grid, Heading, Image, Link, Text } from '@chakra-ui/react';
import { useLocation } from 'wouter';

import FollowButton from '~/components/common/FollowButton';
import { ROUTES } from '~/constants/routes';
import { fallbackImagePath } from '~/constants/strings';
import { ID } from '~/types/common';
import { ShowSearchResult } from '~/types/external';
import { applyViewTransition } from '~/utils/applyViewTransition';

type Props = {
  followedShows: ID[];
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  showToDisplay: ShowSearchResult;
  removeFromFollowedShows: (showId: ID) => void;
  setHasLocalWarningToastBeenShown: () => void;
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

  const [, navigate] = useLocation();
  const yearForDisplay = firstAirDate?.substring(0, 4);
  const posterSource =
    posterPath && `https://image.tmdb.org/t/p/w185${posterPath}`;

  const onShowClick = () => {
    applyViewTransition(() => navigate(`${ROUTES.SHOW}/${showId}`));
  };

  return (
    <Box borderRadius="6px" borderWidth="1px" p="14px" shadow="md">
      <Grid gap={4} templateColumns="100px 1fr">
        <Box w="100px">
          <Link onClick={onShowClick}>
            <Image
              borderRadius="6px"
              onError={e => (e.currentTarget.src = fallbackImagePath)}
              src={posterSource || fallbackImagePath}
            />
          </Link>
        </Box>

        <Flex direction="column" justifyContent="space-evenly" minW="0">
          <Flex w="100%">
            <Box>
              <Link onClick={onShowClick} minW="0">
                <Heading alignSelf="center" lineClamp={2} mr="10px" size="md">
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

          <Text fontSize="14px" lineClamp={3} mt="8px">
            {overview}
          </Text>
        </Flex>
      </Grid>
    </Box>
  );
};

export default SearchResult;
