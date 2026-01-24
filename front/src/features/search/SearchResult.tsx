import { Box, Flex, Grid, Heading, Image, Link, Text } from '@chakra-ui/react';
import { MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import { FollowButton } from '~/components/FollowButton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';
import { TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { createImageUrl } from '~/utils/createImageUrl';

type Props = {
  showToDisplay: TmdbShowSummary;
};

export const SearchResult = ({ showToDisplay }: Props) => {
  const {
    first_air_date: firstAirDate,
    id: showId,
    name,
    overview,
    poster_path: posterPath,
  } = showToDisplay;

  const navigateToShow = useNavigateToShow();
  const isMobile = useIsMobile();
  const yearForDisplay = firstAirDate?.substring(0, 4);
  const posterSource = createImageUrl(posterPath, isMobile);

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) =>
    navigateToShow(e, { showId, name, posterSource });

  return (
    <Box
      borderRadius="6px"
      borderWidth="1px"
      p="14px"
      shadow="md"
      aria-label={`search-result-${name}`}
    >
      <Grid gap={4} templateColumns="100px 1fr">
        <Flex w="100px">
          <Link onClick={onShowClick} href={`${ROUTES.SHOW}/${showId}`}>
            <Image
              borderRadius="6px"
              onError={e =>
                (e.currentTarget.src = createImageUrl(null, isMobile))
              }
              src={posterSource}
              viewTransitionName={`show-image-${showId}`}
            />
          </Link>
        </Flex>

        <Flex direction="column" justifyContent="space-evenly" minW="0">
          <Flex w="100%">
            <Box>
              <Link
                onClick={onShowClick}
                minW="0"
                href={`${ROUTES.SHOW}/${showId}`}
              >
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
