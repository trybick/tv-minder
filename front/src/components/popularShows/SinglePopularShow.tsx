import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Heading, Image, useToast } from '@chakra-ui/core';
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
import { PopularShow } from 'types/external';
import { localWarningToastMessage } from 'constants/toasts';
import { imagePath154 } from 'constants/strings';

interface OwnProps {
  show: PopularShow;
}

const SinglePopularShow = ({ show: { id, name, posterPath } }: OwnProps) => {
  const dispatch = useDispatch();
  const followedShows = useSelector(selectFollowedShows);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const hasLocalWarningToastBeenShown = useSelector(selectHasLocalWarningToastBeenShown);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (followedShows.includes(id)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
    setIsLoading(false); // loading is set to true in follow functions
  }, [followedShows, id]);

  async function onFollowShow() {
    setIsLoading(true);
    dispatch(saveToFollowedShowsAction(id));
    if (!isLoggedIn && !hasLocalWarningToastBeenShown) {
      dispatch(setHasLocalWarningToastBeenShownAction());
      toast(localWarningToastMessage);
    }
  }

  async function onUnFollowShow() {
    setIsLoading(true);
    dispatch(removeFromFollowedShowsAction(id));
  }

  return (
    <Box borderRadius="8px" borderWidth="1px" mb="18px" minWidth="0" ml="20px" width="144px">
      <Image borderRadius="8px 8px 0 0" src={imagePath154 + posterPath} w="154px" />
      <Box p="8px 12px">
        <Heading fontSize="sm" textAlign="center" isTruncated>
          {name}
        </Heading>

        <Button
          isLoading={isLoading}
          leftIcon={isFollowed ? 'check' : 'small-add'}
          m="12px auto 6px"
          minW="108px"
          onClick={isFollowed ? onUnFollowShow : onFollowShow}
          size="sm"
          variant={isFollowed ? 'solid' : 'outline'}
          variantColor="cyan"
        >
          {isFollowed ? 'Followed' : 'Follow'}
        </Button>
      </Box>
    </Box>
  );
};

export default SinglePopularShow;
