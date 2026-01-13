import { Skeleton, SkeletonProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { SKELETON_DELAY } from '~/utils/constants';

interface Props extends SkeletonProps {
  isLoading: boolean;
}

export const DelayedSkeleton = ({ isLoading, children, ...props }: Props) => {
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    if (isLoading) {
      timeoutId = window.setTimeout(() => {
        setShouldShowSkeleton(true);
      }, SKELETON_DELAY);
    } else {
      queueMicrotask(() => setShouldShowSkeleton(false));
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);

  if (!isLoading) {
    return <>{children}</>;
  }

  if (shouldShowSkeleton) {
    return <Skeleton {...props}>{children}</Skeleton>;
  }

  return null;
};
