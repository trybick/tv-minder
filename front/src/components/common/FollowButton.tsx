import { Button, ButtonProps } from '@chakra-ui/react';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';
import { useFollowButton } from 'hooks/useFollowButton';

interface Props {
  showId: number;
}

export const FollowButton = ({ showId, ...rest }: Props & ButtonProps) => {
  const { isFollowed, isLoading, onFollowShow, onUnFollowShow } = useFollowButton(showId);

  return isFollowed ? (
    <Button
      bg="primary"
      color="white"
      isLoading={isLoading}
      leftIcon={<CheckIcon />}
      onClick={onUnFollowShow}
      variant="solid"
      {...rest}
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
      {...rest}
    >
      Follow
    </Button>
  );
};

export default FollowButton;
