import { FollowButton } from '~/components/FollowButton';

type Props = {
  showId: number;
};

export const Follow = ({ showId }: Props) => (
  <FollowButton showId={showId} size="sm" w="100%" mt={0.5} />
);
