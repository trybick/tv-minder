import { Box, Link, Text } from '@chakra-ui/react';
import { type MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';

import { type ShowItem } from './helpers';

type Props = {
  show: ShowItem;
};

export const Title = ({ show }: Props) => {
  const navigateToShow = useNavigateToShow();
  const { getImageUrl } = useImageUrl();
  const posterSource = getImageUrl({ path: show.posterPath });

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigateToShow(e, { showId: show.id, name: show.name, posterSource });
  };

  return (
    <Box>
      <Link
        onClick={onShowClick}
        href={`${ROUTES.SHOW}/${show.id}`}
        _hover={{ textDecoration: 'underline' }}
      >
        <Text fontWeight="semibold" lineClamp={1} fontSize="sm">
          {show.name}
        </Text>
      </Link>
      {show.firstAirDate && (
        <Text fontSize="xs" color="fg.muted" mt="0.5">
          {show.firstAirDate.substring(0, 4)}
        </Text>
      )}
    </Box>
  );
};
