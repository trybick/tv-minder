import { Image } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';
import { createImageUrl } from '~/utils/createImageUrl';
import { getShowIdFromUrl } from '~/utils/getShowIdFromUrl';

const ShowImage = () => {
  const isMobile = useIsMobile();
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);
  const showId = getShowIdFromUrl();

  const imageSrc =
    showDataFromHistory?.posterSource ||
    createImageUrl(currentShowInfo?.posterPath);

  if (isMobile) {
    return (
      <Image
        left="50%"
        maxW="100vw"
        ml="-50vw"
        mr="-50vw"
        position="relative"
        right="50%"
        src={imageSrc}
        width="100vw"
        viewTransitionName={`show-image-${showId}`}
      />
    );
  }

  return (
    <Image
      borderRadius="8px"
      onError={e => (e.currentTarget.src = createImageUrl(null))}
      src={imageSrc}
      viewTransitionName={`show-image-${showId}`}
    />
  );
};

export default ShowImage;
