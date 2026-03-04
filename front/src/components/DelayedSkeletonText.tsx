import { SkeletonText, type SkeletonTextProps } from '@chakra-ui/react';

import { useSkeletonDelay } from '~/hooks/useSkeletonDelay';

interface Props extends SkeletonTextProps {
  isLoading: boolean;
}

export const DelayedSkeletonText = ({ isLoading, ...props }: Props) => {
  const shouldShowSkeleton = useSkeletonDelay(isLoading);

  if (!shouldShowSkeleton) {
    return <SkeletonText {...props} visibility="hidden" animation="none" />;
  }

  return <SkeletonText {...props} />;
};
