import { Button, type ButtonProps } from '@chakra-ui/react';
import { CiCircleMinus } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';

import { useAppDispatch, useAppSelector } from '~/store';
import {
  useFollowShowMutation,
  useUnfollowShowMutation,
} from '~/store/rtk/api/follow.api';
import { makeSelectIsShowFollowed } from '~/store/rtk/slices/user.selectors';
import {
  selectIsLoggedIn,
  unregisteredFollowShow,
  unregisteredUnfollowShow,
} from '~/store/rtk/slices/user.slice';

type Props = {
  showId: number;
  unfollowedWidth?: string;
  followedWidth?: string;
};

export const FollowButton = ({
  showId,
  followedWidth,
  unfollowedWidth,
  ...rest
}: Props & ButtonProps) => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isFollowed = useAppSelector(makeSelectIsShowFollowed(showId));

  const [followShow] = useFollowShowMutation();
  const [unfollowShow] = useUnfollowShowMutation();

  const onFollowShow = async () => {
    if (isLoggedIn) {
      await followShow(showId);
    } else {
      dispatch(unregisteredFollowShow(showId));
    }
  };

  const onUnfollowShow = async () => {
    if (isLoggedIn) {
      await unfollowShow(showId);
    } else {
      dispatch(unregisteredUnfollowShow(showId));
    }
  };

  return isFollowed ? (
    <Button
      aria-label={`follow-button-${showId}`}
      colorPalette="gray"
      onClick={onUnfollowShow}
      variant="surface"
      {...(followedWidth && { minW: followedWidth })}
      {...rest}
    >
      <CiCircleMinus opacity={0.8} />
      Unfollow
    </Button>
  ) : (
    <Button
      aria-label={`follow-button-${showId}`}
      colorPalette="cyan"
      onClick={onFollowShow}
      variant="surface"
      {...(unfollowedWidth && { minW: unfollowedWidth })}
      {...rest}
    >
      <IoMdAdd
        fontSize="22px"
        opacity={0.8}
        style={{ marginInlineEnd: '-0.2rem' }}
      />
      Follow
    </Button>
  );
};
