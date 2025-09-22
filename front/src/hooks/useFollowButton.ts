import { toaster } from '~/components/ui/toaster';
import { useAppDispatch, useAppSelector } from '~/store';
import { selectFollowedShows } from '~/store/user/selectors';
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

export const useFollowButton = (showId: number) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const followedShows = useAppSelector(selectFollowedShows);
  const hasLocalWarningToastBeenShown = useAppSelector(
    selectHasLocalWarningToastBeenShown
  );

  const [followShow] = useFollowShowMutation();
  const [unfollowShow] = useUnfollowShowMutation();

  const isFollowed = followedShows.includes(showId);

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

  return {
    isFollowed,
    onFollowShow,
    onUnFollowShow,
  };
};
