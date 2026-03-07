import { AspectRatio, Image } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';
export const ShowImage = () => {
  const { isMobile } = useResponsiveLayout();

  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);

  const { getImageUrl, placeholder } = useImageUrl();

  const shouldShowSkeleton =
    isLoading &&
    !showDataFromHistory?.posterSource &&
    !currentShowInfo?.posterPath;

  const posterSrc =
    showDataFromHistory?.posterSource ||
    getImageUrl({ path: currentShowInfo?.posterPath });

  return (
    <DelayedSkeleton
      isLoading={shouldShowSkeleton}
      w={isMobile ? '200px' : '280px'}
      h={shouldShowSkeleton ? (isMobile ? '300px' : '405px') : undefined}
      borderRadius="8px"
    >
      <AspectRatio ratio={2 / 3} w={isMobile ? '200px' : '100%'}>
        <Image
          borderRadius="8px"
          onError={e => (e.currentTarget.src = placeholder)}
          src={posterSrc}
          objectFit="cover"
          viewTransitionName={`show-image-${currentShowInfo?.id}`}
        />
      </AspectRatio>
    </DelayedSkeleton>
  );
};
