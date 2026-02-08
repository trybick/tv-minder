import { Button, type ButtonProps, Flex, Icon } from '@chakra-ui/react';
import { CiCircleMinus } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';

import { useAppDispatch, useAppSelector } from '~/store';
import { followApi } from '~/store/rtk/api/follow.api';
import { selectFollowedShowsSet } from '~/store/rtk/slices/user.selectors';
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
  const isFollowed = useAppSelector(state =>
    selectFollowedShowsSet(state).has(showId)
  );

  const onFollowShow = () => {
    if (isLoggedIn) {
      dispatch(followApi.endpoints.followShow.initiate(showId));
    } else {
      // Use manual dispatch instead of RTK mutation to avoid the cost of
      // subscription across many FollowButtons
      dispatch(unregisteredFollowShow(showId));
    }
  };

  const onUnfollowShow = () => {
    if (isLoggedIn) {
      dispatch(followApi.endpoints.unfollowShow.initiate(showId));
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
      role="group"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      _hover={{
        bg: 'red.600',
        borderColor: 'red.600',
        color: 'white',
      }}
      _active={{ bg: 'red.700', borderColor: 'red.700' }}
      {...(followedWidth && { minW: followedWidth })}
      {...rest}
    >
      <Flex align="center" gap={2}>
        <Flex
          align="center"
          gap={2}
          display="flex"
          _groupHover={{ display: 'none' }}
        >
          <Icon as={CiCircleMinus} boxSize="18px" opacity={0.9} />
          Following
        </Flex>
        <Flex
          align="center"
          gap={2}
          display="none"
          _groupHover={{ display: 'flex' }}
        >
          <Icon as={CiCircleMinus} boxSize="18px" opacity={0.95} />
          Unfollow
        </Flex>
      </Flex>
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
      <Icon
        as={IoMdAdd}
        boxSize="22px"
        opacity={0.85}
        style={{ marginInlineEnd: '-0.2rem' }}
      />
      Follow
    </Button>
  );
};
