import { Image } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';
import { createImageUrl } from '~/utils/createImageUrl';

const ShowImage = () => {
  const isMobile = useIsMobile();
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = useSelector(selectShowDataFromHistory);

  if (isMobile) {
    return (
      <Image
        left="50%"
        maxW="100vw"
        ml="-50vw"
        mr="-50vw"
        position="relative"
        right="50%"
        src={createImageUrl(showDataFromHistory?.backdropPath)}
        width="100vw"
        viewTransitionName={showDataFromHistory?.imageViewTransitionName}
      />
    );
  }

  return (
    <Image
      borderRadius="8px"
      onError={e => (e.currentTarget.src = createImageUrl(null, true))}
      src={
        showDataFromHistory?.posterSource ||
        createImageUrl(currentShowInfo?.posterPath, true)
      }
      viewTransitionName={showDataFromHistory?.imageViewTransitionName}
    />
  );
};

export default ShowImage;
