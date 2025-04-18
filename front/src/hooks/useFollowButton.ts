import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from 'store';
import {
  removeFromFollowedShowsAction,
  saveToFollowedShowsAction,
  setHasLocalWarningToastBeenShownAction,
} from 'store/user/actions';
import {
  selectFollowedShows,
  selectHasLocalWarningToastBeenShown,
  selectIsLoggedIn,
} from 'store/user/selectors';
import { ID } from 'types/common';
import { toaster } from '../components/ui/toaster';

export const useFollowButton = (showId: ID) => {
  const dispatch = useAppDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const hasLocalWarningToastBeenShown = useSelector(
    selectHasLocalWarningToastBeenShown
  );
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (followedShows.includes(showId)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
    setIsLoading(false);
  }, [followedShows, showId]);

  async function onFollowShow() {
    setIsLoading(true);
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
    setIsLoading(true);
    dispatch(removeFromFollowedShowsAction(showId));
  }

  return { isFollowed, isLoading, onFollowShow, onUnFollowShow };
};
