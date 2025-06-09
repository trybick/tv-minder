import { Button, ButtonProps } from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';

import { useFollowButton } from '~/hooks/useFollowButton';

type Props = {
  showId: number;
  unfollowedWidth?: string;
  followedWidth?: string;
};

const FollowButton = ({
  showId,
  followedWidth,
  unfollowedWidth,
  ...rest
}: Props & ButtonProps) => {
  const { isFollowed, onFollowShow, onUnFollowShow } = useFollowButton(showId);

  return isFollowed ? (
    <Button
      aria-label={`follow-button-${showId}`}
      colorPalette="cyan"
      onClick={onUnFollowShow}
      variant="surface"
      {...(followedWidth && { minW: followedWidth })}
      {...rest}
    >
      <FaCheck />
      Unfollow
    </Button>
  ) : (
    <Button
      aria-label={`follow-button-${showId}`}
      colorPalette="cyan"
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
