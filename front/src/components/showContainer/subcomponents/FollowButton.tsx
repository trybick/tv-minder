import { Button, ButtonProps } from '@chakra-ui/react';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';
import { useFollowButton } from 'hooks/useFollowButton';

interface Props {
  showId: number;
  styles?: ButtonProps;
}

export const FollowButton = ({ showId, styles }: Props) => {
  const { isFollowed, isLoading, onFollowShow, onUnFollowShow } = useFollowButton(showId);

  return isFollowed ? (
    <Button
      bg="primary"
      color="white"
      isLoading={isLoading}
      leftIcon={<CheckIcon />}
      onClick={onUnFollowShow}
      variant="solid"
      {...styles}
    >
      Following
    </Button>
  ) : (
    <Button
      colorScheme="cyan"
      isLoading={isLoading}
      leftIcon={<SmallAddIcon />}
      onClick={onFollowShow}
      variant="outline"
      {...styles}
    >
      Follow
    </Button>
  );
};

export default FollowButton;
