import { Box, Flex, Grid, Heading, Image, Link, Text } from '@chakra-ui/react';

import { ROUTES } from '~/app/routes';
import FollowButton from '~/components/FollowButton';
import { ShowNavigationState } from '~/features/show/ShowPage';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppDispatch } from '~/store';
import { SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW } from '~/store/tv/actions';
import { ShowSearchResult } from '~/types/external';
import { createImageUrl } from '~/utils/createImageUrl';

type Props = {
  followedShows: number[];
  hasLocalWarningToastBeenShown: boolean;
  isLoggedIn: boolean;
  showToDisplay: ShowSearchResult;
  removeFromFollowedShows: (showId: number) => void;
  setHasLocalWarningToastBeenShown: () => void;
  saveToFollowedShows: (showId: number) => void;
};

const SearchResult = ({ showToDisplay }: Props) => {
  const {
    first_air_date: firstAirDate,
    id: showId,
    name,
    overview,
    poster_path: posterPath,
  } = showToDisplay;

  const navigate = useNavigateWithAnimation();
  const dispatch = useAppDispatch();
  const yearForDisplay = firstAirDate?.substring(0, 4);
  const posterSource = createImageUrl(posterPath);

  const onShowClick = () => {
    dispatch({
      type: SET_IS_LOADING_BASIC_SHOW_INFO_FOR_SHOW,
      payload: true,
    });
    const state: ShowNavigationState = {
      posterSource,
      name,
    };
    navigate(`${ROUTES.SHOW}/${showId}`, { state });
  };

  return (
    <Box borderRadius="6px" borderWidth="1px" p="14px" shadow="md">
      <Grid gap={4} templateColumns="100px 1fr">
        <Flex w="100px">
          <Link onClick={onShowClick}>
            <Image
              borderRadius="6px"
              onError={e => (e.currentTarget.src = createImageUrl(null))}
              src={posterSource}
              viewTransitionName={`show-image-${showId}`}
            />
          </Link>
        </Flex>

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
