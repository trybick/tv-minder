import { Button, ButtonProps } from '@chakra-ui/react';
import { useFollowButton } from 'hooks/useFollowButton';
import { ID } from 'types/common';
import { IoMdAdd } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa6';

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
      colorPalette="cyan"
      loading={isLoading}
      onClick={onUnFollowShow}
      variant="surface"
      {...(followedWidth && { minW: followedWidth })}
      {...rest}
    >
      <FaCheck />
      Following
    </Button>
  ) : (
    <Button
      colorPalette="cyan"
      loading={isLoading}
      onClick={onFollowShow}
      variant="solid"
      {...(unfollowedWidth && { minW: unfollowedWidth })}
      {...rest}
    >
      <IoMdAdd fontSize="22px" style={{ marginInlineEnd: '-0.2rem' }} />
      Follow
    </Button>
  );
};

export default FollowButton;
