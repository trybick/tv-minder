import { Button, ButtonProps } from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';

import { useAppDispatch, useAppSelector } from '~/store';
import {
  useFollowShowMutation,
  useUnfollowShowMutation,
} from '~/store/rtk/api/follow.api';
import { makeSelectIsShowFollowed } from '~/store/rtk/slices/user.selectors';
import {
  selectHasLocalWarningToastBeenShown,
  selectIsLoggedIn,
  setHasLocalWarningToastBeenShown,
  unregisteredFollowShow,
  unregisteredUnfollowShow,
} from '~/store/rtk/slices/user.slice';

import { showToast } from './ui/toaster';

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
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const hasLocalWarningToastBeenShown = useAppSelector(
    selectHasLocalWarningToastBeenShown
  );
  const isFollowed = useAppSelector(makeSelectIsShowFollowed(showId));

  const [followShow] = useFollowShowMutation();
  const [unfollowShow] = useUnfollowShowMutation();

  async function onFollowShow() {
    if (isLoggedIn) {
      await followShow(showId);
    } else {
      dispatch(unregisteredFollowShow(showId));
      if (!hasLocalWarningToastBeenShown) {
        dispatch(setHasLocalWarningToastBeenShown());
        showToast({
          title: "We're saving your shows",
          description: 'You can sign up to avoid losing them',
          type: 'warning',
          duration: 7000,
        });
      }
    }
  }

  async function onUnfollowShow() {
    if (isLoggedIn) {
      await unfollowShow(showId);
    } else {
      dispatch(unregisteredUnfollowShow(showId));
    }
  }

  return isFollowed ? (
    <Button
      aria-label={`follow-button-${showId}`}
      colorPalette="cyan"
      onClick={onUnfollowShow}
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
