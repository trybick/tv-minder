import { SkeletonText, SkeletonTextProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { SKELETON_DELAY } from '~/constants/strings';

interface Props extends SkeletonTextProps {
  isLoading: boolean;
}

const DelayedSkeletonText = ({ isLoading, ...props }: Props) => {
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShouldShowSkeleton(true);
      }, SKELETON_DELAY);
    } else {
      setShouldShowSkeleton(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isLoading]);

  if (isLoading && shouldShowSkeleton) {
    return <SkeletonText {...props} />;
  }

  return null;
};

export default DelayedSkeletonText;
