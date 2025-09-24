import { Button, ButtonProps } from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa6';
import { IoMdAdd } from 'react-icons/io';

import { useAppDispatch, useAppSelector } from '~/store';
import { makeSelectIsShowFollowed } from '~/store/user/selectors';
import {
  useFollowShowMutation,
  useUnfollowShowMutation,
} from '~/store/user/user.api';
import {
  selectHasLocalWarningToastBeenShown,
  selectIsLoggedIn,
  setHasLocalWarningToastBeenShown,
  unregisteredFollowShow,
  unregisteredUnfollowShow,
} from '~/store/user/user.slice';

import { toaster } from './ui/toaster';

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

  const [followShow] = useFollowShowMutation();
  const [unfollowShow] = useUnfollowShowMutation();

  const isFollowed = useAppSelector(makeSelectIsShowFollowed(showId));

  async function onFollowShow() {
    if (isLoggedIn) {
      try {
        await followShow(showId).unwrap();
      } catch (error) {
        console.error('Failed to follow show:', error);
      }
    } else {
      dispatch(unregisteredFollowShow(showId));
      if (!hasLocalWarningToastBeenShown) {
        dispatch(setHasLocalWarningToastBeenShown());
        toaster.create({
          title: "We're saving your shows",
          description: 'You can sign up to avoid losing them',
          type: 'warning',
          duration: 7000,
          meta: { closable: true },
        });
      }
    }
  }

  async function onUnFollowShow() {
    if (isLoggedIn) {
      try {
        await unfollowShow(showId).unwrap();
      } catch (error) {
        console.error('Failed to unfollow show:', error);
      }
    } else {
      dispatch(unregisteredUnfollowShow(showId));
    }
  }

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
