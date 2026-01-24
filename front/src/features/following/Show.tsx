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
    show: { id, name, posterPath, firstAirDate },
  } = props;
  const navigateToShow = useNavigateToShow();
  const yearForDisplay = firstAirDate?.substring(0, 4);

  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: posterPath });

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
      </Link>
      <Flex direction="column" p="3" gap="2" flex="1" justify="space-between">
        <Box>
          <Link
            onClick={onShowClick}
            href={`${ROUTES.SHOW}/${id}`}
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
      </Flex>
    </Flex>
  );
};
