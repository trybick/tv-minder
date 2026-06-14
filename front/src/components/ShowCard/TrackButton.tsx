import { useShowCardContext } from '~/components/ShowCard/context';
import { TrackButton as BaseTrackButton } from '~/components/TrackButton';

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
