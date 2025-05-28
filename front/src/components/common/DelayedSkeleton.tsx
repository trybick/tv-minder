import { Skeleton, SkeletonProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const SKELETON_DELAY = 300;

interface Props extends SkeletonProps {
  isLoading: boolean;
}

const DelayedSkeleton = ({ isLoading, children, ...props }: Props) => {
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

  if (!isLoading) {
    return <>{children}</>;
  }

  if (shouldShowSkeleton) {
    return <Skeleton {...props}>{children}</Skeleton>;
  }

  return null;
};

export default DelayedSkeleton;
