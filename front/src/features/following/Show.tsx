import { Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import { type MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';
import { type ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show: ShowForDisplay;
};

export const Show = (props: Props) => {
  const {
    show: { id, name, posterPath, firstAirDate, status },
  } = props;
  const yearForDisplay = firstAirDate?.substring(0, 4);

  const navigateToShow = useNavigateToShow();

  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: posterPath });

  const statusForBadge = status.isActiveSeason
    ? ({ label: 'Currently Airing', color: 'green.500' } as const)
    : status.isPremieringSoon
      ? ({ label: 'Premiering Soon', color: 'purple.500' } as const)
      : null;

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigateToShow(e, { showId: id, name, posterSource });
  };

  return (
    <Flex
      direction="column"
      key={id}
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
        href={`${ROUTES.SHOW}/${id}`}
        display="block"
        position="relative"
      >
        <Image
          alt={`show-${name}`}
          aspectRatio={2 / 3}
          objectFit="cover"
          w="100%"
          onError={e => (e.currentTarget.src = placeholder)}
          src={posterSource}
          viewTransitionName={`show-image-${id}`}
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
      </Link>
      <Flex direction="column" p="3" gap="2" flex="1" justify="space-between">
        <Box>
          <Link
            onClick={onShowClick}
            href={`${ROUTES.SHOW}/${id}`}
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
      </Flex>
    </Flex>
  );
};
