import { FollowButton as BaseFollowButton } from '~/components/FollowButton';

import { useShowCardContext } from './context';

export const FollowButton = () => {
  const { show, followButtonSize = 'md' } = useShowCardContext();
  return (
    <BaseFollowButton
      showId={show.id}
      size={followButtonSize}
      w="100%"
      mt={0.5}
    />
  );
};
