import { Center, Spinner } from '@chakra-ui/react';
import { lazy, Suspense } from 'react';

const YouTube = lazy(() => import('react-youtube'));

export const YOUTUBE_PLAYER_OPTIONS = {
  height: '100%',
  playerVars: { autoplay: 1 },
  width: '100%',
};

type Props = {
  videoId: string;
};

export const YouTubePlayer = ({ videoId }: Props) => {
  return (
    <Suspense
      fallback={
        <Center h="100%" w="100%">
          <Spinner size="lg" />
        </Center>
      }
    >
      <YouTube opts={YOUTUBE_PLAYER_OPTIONS} videoId={videoId} />
    </Suspense>
  );
};
