import { Button } from '@chakra-ui/react';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';
import { useFollowButton } from 'hooks/useFollowButton';

interface Props {
  showId: number;
}

export const FollowButton = ({ showId }: Props) => {
  const { isFollowed, isLoading, onFollowShow, onUnFollowShow } = useFollowButton(showId);

  return isFollowed ? (
    <Button
      bg="primary"
      color="white"
      isLoading={isLoading}
      leftIcon={<CheckIcon />}
      minW="102px"
      onClick={onUnFollowShow}
      size="sm"
      variant="solid"
    >
      Following
    </Button>
  ) : (
    <Button
      colorScheme="cyan"
      isLoading={isLoading}
      leftIcon={<SmallAddIcon />}
      minW="88px"
      onClick={onFollowShow}
      size="sm"
      variant="outline"
    >
      Follow
    </Button>
  );
};

export default FollowButton;
