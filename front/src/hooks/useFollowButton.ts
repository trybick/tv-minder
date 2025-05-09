import { useEffect, useState } from 'react';

import { toaster } from '~/components/ui/toaster';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  removeFromFollowedShowsAction,
  saveToFollowedShowsAction,
  setHasLocalWarningToastBeenShownAction,
} from '~/store/user/actions';
import {
  selectFollowedShows,
  selectHasLocalWarningToastBeenShown,
  selectIsLoggedIn,
} from '~/store/user/selectors';
import { ID } from '~/types/common';

export const useFollowButton = (showId: ID) => {
  const dispatch = useAppDispatch();
  const followedShows = useAppSelector(selectFollowedShows);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const hasLocalWarningToastBeenShown = useAppSelector(
    selectHasLocalWarningToastBeenShown
  );
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (followedShows.includes(showId)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [followedShows, showId]);

  async function onFollowShow() {
    setIsFollowed(true);
    dispatch(saveToFollowedShowsAction(showId));
    if (!isLoggedIn && !hasLocalWarningToastBeenShown) {
      dispatch(setHasLocalWarningToastBeenShownAction());
      toaster.create({
        title: "We're saving your shows",
        description: 'You can sign up to avoid losing them',
        type: 'warning',
        duration: 7000,
        meta: { closable: true },
      });
    }
  }

  async function onUnFollowShow() {
    setIsFollowed(false);
    dispatch(removeFromFollowedShowsAction(showId));
  }

  return { isFollowed, onFollowShow, onUnFollowShow };
};
