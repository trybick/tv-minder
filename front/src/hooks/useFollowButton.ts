import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localWarningToastMessage } from 'constants/toasts';
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

export const useFollowButton = (showId: ID) => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const hasLocalWarningToastBeenShown = useSelector(selectHasLocalWarningToastBeenShown);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

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
      toast(localWarningToastMessage);
    }
  }

  async function onUnFollowShow() {
    setIsLoading(true);
    dispatch(removeFromFollowedShowsAction(showId));
  }

  return { isFollowed, isLoading, onFollowShow, onUnFollowShow };
};
