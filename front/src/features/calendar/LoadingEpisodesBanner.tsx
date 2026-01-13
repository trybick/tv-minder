import { Alert, Spinner } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from '~/store';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';

import { NoFollowedShowsBanner } from './NoFollowedShowsBanner';

const MIN_SHOW_MS = 2000;

export const LoadingEpisodesBanner = ({
  isLoading,
  hasNoEpisodesThisMonth,
}: {
  isLoading: boolean;
  hasNoEpisodesThisMonth: boolean;
}) => {
  const [isShown, setIsShown] = useState(false);
  const shownAt = useRef<number>(0);

  const followedShows = useAppSelector(selectFollowedShows);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!followedShows.length) {
      return;
    }

    if (isLoading && !isShown) {
      queueMicrotask(() => {
        setIsShown(true);
      });
      shownAt.current = Date.now();
    }

    if (!isLoading && isShown) {
      const elapsed = Date.now() - shownAt.current;
      const remaining = Math.max(0, MIN_SHOW_MS - elapsed);
      timer = setTimeout(() => {
        setIsShown(false);
      }, remaining);
    }

    return () => clearTimeout(timer);
  }, [isLoading, isShown, followedShows.length]);

  if (!isShown) {
    return hasNoEpisodesThisMonth ? <NoFollowedShowsBanner /> : null;
  }

  return (
    <Alert.Root
      colorPalette="cyan"
      status="info"
      size="sm"
      variant="subtle"
      w="fit-content"
    >
      <Spinner size="sm" />
      <Alert.Title fontSize="14px">Refreshing</Alert.Title>
    </Alert.Root>
  );
};
