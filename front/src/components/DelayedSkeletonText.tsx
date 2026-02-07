import { SkeletonText, type SkeletonTextProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { SKELETON_DELAY } from '~/utils/constants';

interface Props extends SkeletonTextProps {
  isLoading: boolean;
}

export const DelayedSkeletonText = ({ isLoading, ...props }: Props) => {
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

  if (!shouldShowSkeleton) {
    // Reserve the final space during the delay window.
    return <SkeletonText {...props} visibility="hidden" animation="none" />;
  }

  return <SkeletonText {...props} />;
};
