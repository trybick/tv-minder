import { useEffect, useState } from 'react';

import { SKELETON_DELAY } from '~/utils/constants';

export const useSkeletonDelay = (isLoading: boolean): boolean => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    if (isLoading) {
      timeoutId = window.setTimeout(() => setShouldShow(true), SKELETON_DELAY);
    } else {
      queueMicrotask(() => setShouldShow(false));
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  return shouldShow;
};
