import { FollowButton as BaseFollowButton } from '~/components/FollowButton';

type Props = {
  showId: number;
};

export const FollowButton = ({ showId }: Props) => (
  <BaseFollowButton showId={showId} size="sm" w="100%" mt={0.5} />
);
