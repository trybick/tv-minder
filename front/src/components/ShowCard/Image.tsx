import { Image as ChakraImage, Link } from '@chakra-ui/react';
import { type MouseEvent, type PropsWithChildren } from 'react';

import { ROUTES } from '~/app/routes';
import { useShowCardContext } from '~/components/ShowCard/context';
import { usePreventClickOnDrag } from '~/components/ShowCard/usePreventClickOnDrag';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateToShow } from '~/hooks/useNavigateToShow';

export const Image = ({ children }: PropsWithChildren) => {
  const { show } = useShowCardContext();
  const navigateToShow = useNavigateToShow();
  const { dragListeners, shouldCancelClick } = usePreventClickOnDrag();
  const { getImageUrl, placeholder } = useImageUrl();
  const posterSource = getImageUrl({ path: show.posterPath });

  // Since the same show can be rendered in multiple carousels which causes
  // duplicate view transitions, that causes it to be ignored so we need to
  // manually set the view transition name here.
  const addViewTransitionName = (e: MouseEvent<HTMLAnchorElement>) => {
    const img = e.currentTarget.querySelector('img');
    if (img) {
      img.style.viewTransitionName = `show-image-${show.id}`;
    }
  };

  const onShowClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (shouldCancelClick(e)) {
      return;
    }
    addViewTransitionName(e);
    navigateToShow(e, { showId: show.id, name: show.name, posterSource });
  };

  return (
    <Link
      onClick={onShowClick}
      {...dragListeners}
      href={`${ROUTES.SHOW}/${show.id}`}
      aria-label={`View ${show.name}`}
      position="relative"
      display="block"
      overflow="hidden"
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'cyan.400',
        outlineOffset: '2px',
      }}
    >
      <ChakraImage
        alt=""
        aspectRatio={2 / 3}
        objectFit="cover"
        w="100%"
        loading="lazy"
        onError={e => (e.currentTarget.src = placeholder)}
        src={posterSource}
      />
      {children}
    </Link>
  );
};
