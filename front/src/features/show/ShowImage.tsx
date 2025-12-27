import { Image } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import DelayedSkeleton from '~/components/DelayedSkeleton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
  selectShowDataFromHistory,
} from '~/store/legacy/tv/selectors';
import { createImageUrl } from '~/utils/createImageUrl';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

const ShowImage = () => {
  const isMobile = useIsMobile();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);
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
          src={createImageUrl(currentShowInfo?.backdropPath, isMobile, true)}
          width="100vw"
        />
      </DelayedSkeleton>
    );
  }

  return (
    <DelayedSkeleton isLoading={shouldShowDesktopSkeleton}>
      <Image
        borderRadius="8px"
        onError={e => (e.currentTarget.src = createImageUrl(null, isMobile))}
        src={
          showDataFromHistory?.posterSource ||
          createImageUrl(currentShowInfo?.posterPath, isMobile)
        }
        viewTransitionName={`show-image-${showId}`}
      />
    </DelayedSkeleton>
  );
};

export default ShowImage;
