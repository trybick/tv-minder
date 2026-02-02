import { FollowButton as BaseFollowButton } from '~/components/FollowButton';

import { useShowCardContext } from './context';

export const FollowButton = () => {
  const { show } = useShowCardContext();
  return <BaseFollowButton showId={show.id} size="sm" w="100%" mt={0.5} />;
};
