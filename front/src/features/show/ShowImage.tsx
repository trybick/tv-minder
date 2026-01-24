import { AspectRatio, Image } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

export const ShowImage = () => {
  const isMobile = useIsMobile();

  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);

  const { getImageUrl, placeholder } = useImageUrl();
  const showId = getShowIdFromUrl();

  const shouldShowDesktopSkeleton =
    isLoading &&
    !showDataFromHistory?.posterSource &&
    !currentShowInfo?.posterPath;

  if (isMobile) {
    return (
      <DelayedSkeleton isLoading={isLoading} h="232px" w="100%">
        <Image
          left="50%"
          maxW="100vw"
          minHeight="232px"
          ml="-50vw"
          mr="-50vw"
          position="relative"
          right="50%"
          src={getImageUrl({
            path: currentShowInfo?.backdropPath,
            quality: 'high',
          })}
          width="100vw"
        />
      </DelayedSkeleton>
    );
  }

  return (
    <DelayedSkeleton
      isLoading={shouldShowDesktopSkeleton}
      w="300px"
      h={shouldShowDesktopSkeleton ? '450px' : undefined}
      borderRadius="8px"
    >
      <AspectRatio ratio={2 / 3} w="100%">
        <Image
          borderRadius="8px"
          onError={e => (e.currentTarget.src = placeholder)}
          src={
            showDataFromHistory?.posterSource ||
            getImageUrl({ path: currentShowInfo?.posterPath })
          }
          objectFit="cover"
          viewTransitionName={`show-image-${showId}`}
        />
      </AspectRatio>
    </DelayedSkeleton>
  );
};
