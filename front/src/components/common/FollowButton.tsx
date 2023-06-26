import { Button, ButtonProps } from '@chakra-ui/react';
import { CheckIcon, SmallAddIcon } from '@chakra-ui/icons';
import { useFollowButton } from 'hooks/useFollowButton';
import { ID } from 'types/common';

type Props = {
  showId: ID;
  unfollowedWidth?: string;
  followedWidth?: string;
};

export const FollowButton = ({
  showId,
  followedWidth,
  unfollowedWidth,
  ...rest
}: Props & ButtonProps) => {
  const { isFollowed, isLoading, onFollowShow, onUnFollowShow } = useFollowButton(showId);

  return isFollowed ? (
    <Button
      bg="primary"
      color="white"
      isLoading={isLoading}
      leftIcon={<CheckIcon />}
      onClick={onUnFollowShow}
      variant="solid"
      {...(followedWidth && { minW: followedWidth })}
      {...rest}
    >
      Following
    </Button>
  ) : (
    <Button
      colorScheme="cyan"
      isLoading={isLoading}
      leftIcon={<SmallAddIcon fontSize="22px" marginInlineEnd="-0.2rem" />}
      onClick={onFollowShow}
      variant="outline"
      {...(unfollowedWidth && { minW: unfollowedWidth })}
      {...rest}
    >
      Follow
    </Button>
  );
};

export default FollowButton;
