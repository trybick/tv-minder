import { TrackButton as BaseTrackButton } from '~/components/TrackButton';

import { useShowCardContext } from './context';

export const TrackButton = () => {
  const { show, trackButtonSize = 'md' } = useShowCardContext();
  return (
    <BaseTrackButton
      showId={show.id}
      size={trackButtonSize}
      w="100%"
      showName={show.name}
      mt={0.5}
    />
  );
};
