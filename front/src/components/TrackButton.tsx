import { Button, type ButtonProps, Flex, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { CiCircleMinus } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { MdCheckCircleOutline } from 'react-icons/md';

import { useAppDispatch, useAppSelector } from '~/store';
import { trackApi } from '~/store/rtk/api/track.api';
import { selectTrackedShowsSet } from '~/store/rtk/slices/user.selectors';
import {
  selectIsLoggedIn,
  unregisteredTrackShow,
  unregisteredUntrackShow,
} from '~/store/rtk/slices/user.slice';
import { trackEvent } from '~/utils/analytics';

type Props = {
  showId: number;
  untrackedWidth?: string;
  trackedWidth?: string;
  showName: string;
};

export const TrackButton = ({
  showId,
  trackedWidth,
  untrackedWidth,
  showName,
  ...rest
}: Props & ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isTracked = useAppSelector(state =>
    selectTrackedShowsSet(state).has(showId)
  );

  const onTrackShow = () => {
    trackEvent({
      category: 'Show',
      action: 'Track Show',
      label: `${showName} (${showId.toString()})`,
    });
    if (isLoggedIn) {
      dispatch(trackApi.endpoints.trackShow.initiate(showId));
    } else {
      // Use manual dispatch instead of RTK mutation to avoid the cost of
      // subscription across many FollowButtons
      dispatch(unregisteredTrackShow(showId));
    }
  };

  const onUntrackShow = () => {
    trackEvent({
      category: 'Show',
      action: 'Untrack Show',
      label: `${showName} (${showId.toString()})`,
    });
    if (isLoggedIn) {
      dispatch(trackApi.endpoints.untrackShow.initiate(showId));
    } else {
      dispatch(unregisteredUntrackShow(showId));
    }
  };

  return isTracked ? (
    <Button
      aria-label={`track-button-${showId}`}
      colorPalette="gray"
      onClick={onUntrackShow}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="surface"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      _hover={{
        bg: 'red.600',
        borderColor: 'red.600',
        color: 'white',
      }}
      _active={{ bg: 'red.700', borderColor: 'red.700' }}
      {...(trackedWidth && { minW: trackedWidth })}
      {...rest}
    >
      <Flex align="center" gap={2}>
        {isHovered ? (
          <>
            <Icon as={CiCircleMinus} boxSize="18px" opacity={0.95} />
            Untrack
          </>
        ) : (
          <>
            <Icon as={MdCheckCircleOutline} boxSize="18px" opacity={0.9} />
            Tracking
          </>
        )}
      </Flex>
    </Button>
  ) : (
    <Button
      aria-label={`track-button-${showId}`}
      colorPalette="cyan"
      onClick={onTrackShow}
      variant="surface"
      {...(untrackedWidth && { minW: untrackedWidth })}
      {...rest}
    >
      <Icon
        as={IoMdAdd}
        boxSize="22px"
        opacity={0.85}
        style={{ marginInlineEnd: '-0.2rem' }}
      />
      Track
    </Button>
  );
};
