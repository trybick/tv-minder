import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import { type MouseEvent, useState } from 'react';

import { ROUTES } from '~/app/routes';
import { FollowButton } from '~/components/FollowButton';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';
import { type PopularShow as PopularShowType } from '~/store/tv/types/transformed';

type Props = {
  show: PopularShowType;
};

export const PopularShow = ({ show }: Props) => {
  const { id: showId, name, posterPath, overview, firstAirDate } = show;
  const yearForDisplay = firstAirDate?.substring(0, 4);
  const navigateToShow = useNavigateToShow();
  const [isHovered, setIsHovered] = useState(false);

  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: posterPath });

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigateToShow(e, { showId, name, posterSource });
  };

  return (
    <Flex
      direction="column"
      h="100%"
      borderRadius="lg"
      border="1px solid"
      borderColor="whiteAlpha.100"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ borderColor: 'whiteAlpha.400' }}
      flexGrow="1"
      justifyContent="space-between"
      maxW="238px"
      w={{ base: '140px', md: '190px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        onClick={onShowClick}
        href={`${ROUTES.SHOW}/${showId}`}
        display="block"
        transition="transform 0.2s"
        _hover={{ transform: 'scale(1.03)' }}
        position="relative"
      >
        <Image
          alt={`popular-show-${name}`}
          aspectRatio={2 / 3}
          objectFit="cover"
          w="100%"
          onError={e => (e.currentTarget.src = placeholder)}
          src={posterSource}
          viewTransitionName={`show-image-${showId}`}
        />

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
            href={`${ROUTES.SHOW}/${showId}`}
            onClick={onShowClick}
            _hover={{ textDecoration: 'underline' }}
          >
            <Text
              as="button"
              cursor="pointer"
              fontWeight="semibold"
              lineClamp={1}
              fontSize="sm"
            >
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
