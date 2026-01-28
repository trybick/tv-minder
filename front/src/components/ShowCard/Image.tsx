import { Image as ChakraImage, Link } from '@chakra-ui/react';
import { type MouseEvent, type PropsWithChildren } from 'react';

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';

import { type ShowItem } from './helpers';

type Props = PropsWithChildren<{
  show: ShowItem;
}>;

export const Image = ({ show, children }: Props) => {
  const navigateToShow = useNavigateToShow();
  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: show.posterPath });

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    navigateToShow(e, { showId: show.id, name: show.name, posterSource });
  };

  return (
    <Link
      onClick={onShowClick}
      href={`${ROUTES.SHOW}/${show.id}`}
      position="relative"
      display="block"
      overflow="hidden"
    >
      <ChakraImage
        alt={`show-${show.name}`}
        aspectRatio={2 / 3}
        objectFit="cover"
        w="100%"
        onError={e => (e.currentTarget.src = placeholder)}
        src={posterSource}
        viewTransitionName={`show-image-${show.id}`}
        transition="transform 0.3s ease-out"
        // Uses parent's data-group to scale on hover.
        _groupHover={{ transform: 'scale(1.05)' }}
      />
      {children}
    </Link>
  );
};
