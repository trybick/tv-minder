import { Box, Link, Text } from '@chakra-ui/react';
import { type MouseEvent } from 'react';

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';

import { type ShowItem } from './helpers';
import { usePreventClickOnDrag } from './usePreventClickOnDrag';

type Props = {
  show: ShowItem;
};

export const Title = ({ show }: Props) => {
  const navigateToShow = useNavigateToShow();
  const { dragListeners, shouldCancelClick } = usePreventClickOnDrag();
  const { getImageUrl } = useImageUrl();
  const posterSource = getImageUrl({ path: show.posterPath });

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldCancelClick(e)) {
      return;
    }
    navigateToShow(e, { showId: show.id, name: show.name, posterSource });
  };

  return (
    <Box>
      <Link
        onClick={onShowClick}
        {...dragListeners}
        href={`${ROUTES.SHOW}/${show.id}`}
        _hover={{ textDecoration: 'underline', color: 'cyan.400' }}
        transition="color 0.15s"
      >
        <Text fontWeight="600" lineClamp={1} fontSize="sm" color="fg">
          {show.name}
        </Text>
      </Link>
      {show.firstAirDate && (
        <Text fontSize="xs" color="fg.muted" mt="1">
          {show.firstAirDate.substring(0, 4)}
        </Text>
      )}
    </Box>
  );
};
