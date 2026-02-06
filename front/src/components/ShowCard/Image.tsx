import { Image as ChakraImage, Link } from '@chakra-ui/react';
import { type MouseEvent, type PropsWithChildren } from 'react';

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';

import { useShowCardContext } from './context';
import { usePreventClickOnDrag } from './usePreventClickOnDrag';

export const Image = ({ children }: PropsWithChildren) => {
  const { show } = useShowCardContext();
  const navigateToShow = useNavigateToShow();
  const { dragListeners, shouldCancelClick } = usePreventClickOnDrag();
  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: show.posterPath });

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldCancelClick(e)) {
      return;
    }
    navigateToShow(e, { showId: show.id, name: show.name, posterSource });
  };

  return (
    <Link
      onClick={onShowClick}
      {...dragListeners}
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
      />
      {children}
    </Link>
  );
};
