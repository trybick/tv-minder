import { Skeleton, type SkeletonProps } from '@chakra-ui/react';

import { useSkeletonDelay } from '~/hooks/useSkeletonDelay';

interface Props extends SkeletonProps {
  isLoading: boolean;
}

export const DelayedSkeleton = ({ isLoading, children, ...props }: Props) => {
  const shouldShowSkeleton = useSkeletonDelay(isLoading);

  if (!isLoading) {
    return <>{children}</>;
  }

  if (shouldShowSkeleton) {
    return <Skeleton {...props}>{children}</Skeleton>;
  }

  return (
    <Skeleton {...props} visibility="hidden" animation="none">
      {children}
    </Skeleton>
  );
};
