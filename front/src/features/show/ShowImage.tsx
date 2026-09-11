import { AspectRatio, Image } from '@chakra-ui/react';
import { useParams } from 'wouter';
import { useHistoryState } from 'wouter/use-browser-location';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useImageUrl } from '~/hooks/useImageUrl';
import { type ShowNavigationState } from '~/hooks/useNavigateToShow';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import {
  selectCurrentShowInfo,
  selectIsLoadingShowDetails,
} from '~/store/tv/selectors';
import { parseShowId } from '~/utils/parseShowId';
import {
  SHOW_IMAGE_TRANSITION_CLASS,
  getShowImageTransitionName,
} from '~/utils/viewTransition';

export const ShowImage = () => {
  const { isMobile } = useResponsiveLayout();
  const historyState = useHistoryState<ShowNavigationState>();
  const { showId } = useParams<{ showId: string }>();
  const parsedShowId = parseShowId(showId);

  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const currentShowInfo = useAppSelector(selectCurrentShowInfo);
  const showDataFromHistory = historyState?.posterSource ? historyState : null;

  const { getImageUrl, placeholder } = useImageUrl();

  const shouldShowSkeleton =
    isLoading &&
    !showDataFromHistory?.posterSource &&
    !currentShowInfo?.posterPath;

  const posterSrc =
    showDataFromHistory?.posterSource ||
    getImageUrl({ path: currentShowInfo?.posterPath });

  const transitionShowId = parsedShowId ?? currentShowInfo?.id;

  return (
    <DelayedSkeleton
      isLoading={shouldShowSkeleton}
      w={isMobile ? '200px' : '340px'}
      h={shouldShowSkeleton ? (isMobile ? '300px' : '510px') : undefined}
      borderRadius="8px"
    >
      <AspectRatio ratio={2 / 3} w={isMobile ? '200px' : '100%'}>
        <Image
          borderRadius="8px"
          onError={e => (e.currentTarget.src = placeholder)}
          src={posterSrc}
          objectFit="cover"
          viewTransitionName={
            transitionShowId
              ? getShowImageTransitionName(transitionShowId)
              : undefined
          }
          css={{
            viewTransitionClass: SHOW_IMAGE_TRANSITION_CLASS,
          }}
        />
      </AspectRatio>
    </DelayedSkeleton>
  );
};
