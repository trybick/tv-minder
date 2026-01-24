import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import { type MouseEvent, useMemo, useState } from 'react';

import { ROUTES } from '~/app/routes';
import { FollowButton } from '~/components/FollowButton';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';
import { useAppSelector } from '~/store';
import {
  selectSearchShowDetails,
  selectShowDetails,
} from '~/store/tv/selectors';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { mapShowInfoForDisplay } from '~/store/tv/utils/formatting';

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
  const yearForDisplay = firstAirDate?.substring(0, 4);
  const navigateToShow = useNavigateToShow();

  const [isHovered, setIsHovered] = useState(false);

  const showDetails = useAppSelector(selectShowDetails);
  const searchShowDetails = useAppSelector(selectSearchShowDetails);

  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: posterPath });

  const statusForBadge = useMemo(() => {
    const cachedShow = showDetails?.[showId] ?? searchShowDetails?.[showId];
    if (!cachedShow) {
      return null;
    }
    const { status } = mapShowInfoForDisplay(cachedShow);
    if (status.isActiveSeason) {
      return { label: 'Currently Airing', color: 'green.500' } as const;
    }
    if (status.isPremieringSoon) {
      return { label: 'Premiering Soon', color: 'purple.500' } as const;
    }

    return null;
  }, [showDetails, searchShowDetails, showId]);

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigateToShow(e, { showId, name, posterSource });
  };

  return (
    <Flex
      direction="column"
      aria-label={`search-result-${name}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      h="100%"
      borderRadius="lg"
      border="1px solid"
      borderColor="whiteAlpha.100"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ borderColor: 'whiteAlpha.400' }}
    >
      <Link
        onClick={onShowClick}
        href={`${ROUTES.SHOW}/${showId}`}
        position="relative"
        display="block"
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.03)' }}
      >
        <Image
          aspectRatio={2 / 3}
          objectFit="cover"
          w="100%"
          onError={e => (e.currentTarget.src = placeholder)}
          src={posterSource}
          viewTransitionName={`show-image-${showId}`}
        />

        {statusForBadge && (
          <Box
            position="absolute"
            top="2"
            left="2"
            bg={statusForBadge.color}
            color="white"
            fontSize="xs"
            fontWeight="bold"
            px="2"
            py="1"
            borderRadius="md"
            letterSpacing="0.2px"
            textTransform="uppercase"
          >
            {statusForBadge.label}
          </Box>
        )}

        {overview && (
          <Box
            position="absolute"
            inset="0"
            bg="blackAlpha.800"
            opacity={isHovered ? 1 : 0}
            transition="opacity 0.2s"
            p="3"
            display={{ base: 'none', md: 'flex' }}
            alignItems="flex-end"
          >
            <Text fontSize="sm" lineClamp={6} color="white">
              {overview}
            </Text>
          </Box>
        )}
      </Link>

      <Flex direction="column" p="3" gap="2" flex="1" justify="space-between">
        <Box>
          <Link
            onClick={onShowClick}
            href={`${ROUTES.SHOW}/${showId}`}
            _hover={{ textDecoration: 'underline' }}
          >
            <Text fontWeight="semibold" lineClamp={1} fontSize="sm">
              {name}
            </Text>
          </Link>
          {yearForDisplay && (
            <Text fontSize="xs" color="fg.muted" mt="0.5">
              {yearForDisplay}
            </Text>
          )}
        </Box>

        <FollowButton showId={showId} size="sm" w="100%" mt={0.5} />
      </Flex>
    </Flex>
  );
};
