import { Image } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import DelayedSkeleton from '~/components/DelayedSkeleton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingBasicShowInfoForShow,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';
import { createImageUrl } from '~/utils/createImageUrl';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

const ShowImage = () => {
  const isMobile = useIsMobile();
  const isLoading = useAppSelector(selectIsLoadingBasicShowInfoForShow);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);
  const showId = getShowIdFromUrl();

  if (isMobile) {
    return (
      <DelayedSkeleton isLoading={isLoading} h="200px" w="100%">
        <Image
          left="50%"
          maxW="100vw"
          ml="-50vw"
          mr="-50vw"
          position="relative"
          right="50%"
          src={createImageUrl(currentShowInfo?.backdropPath)}
          width="100vw"
          viewTransitionName={`show-image-${showId}`}
        />
      </DelayedSkeleton>
    );
  }

  return (
    <Image
      borderRadius="8px"
      onError={e => (e.currentTarget.src = createImageUrl(null))}
      src={
        showDataFromHistory?.posterSource ||
        createImageUrl(currentShowInfo?.posterPath)
      }
      viewTransitionName={`show-image-${showId}`}
    />
  );
};

export default ShowImage;
