import { Image } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { fallbackImagePathLarge, imagePath780 } from '~/constants/strings';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectShowDataFromHistory,
} from '~/store/tv/selectors';

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
        src={imagePath780 + showDataFromHistory?.backdropPath}
        width="100vw"
        viewTransitionName={showDataFromHistory?.imageViewTransitionName}
      />
    );
  }

  return (
    <Image
      borderRadius="8px"
      onError={e => (e.currentTarget.src = fallbackImagePathLarge)}
      src={
        showDataFromHistory?.posterSource ||
        imagePath780 + currentShowInfo?.posterPath ||
        fallbackImagePathLarge
      }
      viewTransitionName={showDataFromHistory?.imageViewTransitionName}
    />
  );
};

export default ShowImage;
