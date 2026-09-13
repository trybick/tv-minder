import { useEffect, useState } from 'react';

import { SKELETON_DELAY } from '~/utils/constants';
import { isImageViewTransitionActive } from '~/utils/viewTransition';

export const useSkeletonDelay = (isLoading: boolean): boolean => {
  const skipDelay = isLoading && isImageViewTransitionActive();
  const [shouldShow, setShouldShow] = useState(skipDelay);

  useEffect(() => {
    let timeoutId: number;

    if (skipDelay) {
      setShouldShow(true);
      return;
    }

    if (isLoading) {
      timeoutId = window.setTimeout(() => setShouldShow(true), SKELETON_DELAY);
    } else {
      queueMicrotask(() => setShouldShow(false));
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading, skipDelay]);

  if (skipDelay) {
    return true;
  }

  return shouldShow;
};
