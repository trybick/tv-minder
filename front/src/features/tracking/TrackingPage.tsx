import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch, useAppSelector } from '~/store';
import { useGetTrackedShowsQuery } from '~/store/rtk/api/track.api';
import { selectTrackedShows } from '~/store/rtk/slices/user.selectors';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { getShowDetailsForTrackedShows } from '~/store/tv/actions';
import { selectTrackedShowsDetails } from '~/store/tv/selectors';

import { ManageSkeleton } from './ManageSkeleton';
import { NoTrackedShowsMessage } from './NoTrackedShowsMessage';
import { TrackingList } from './TrackingList';

export const TrackingPage = () => {
  const { isMobile } = useResponsiveLayout();
  const dispatch = useAppDispatch();
  const trackedShows = useAppSelector(selectTrackedShows);
  const trackedShowsDetails = useAppSelector(selectTrackedShowsDetails);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const { isLoading } = useGetTrackedShowsQuery(undefined, {
    skip: !isLoggedIn,
  });

  useEffect(() => {
    dispatch(getShowDetailsForTrackedShows());
  }, [dispatch, trackedShows]);

  const isNoTrackedShows = !isLoading && trackedShows.length === 0;
  const isLoadingShowDetails =
    trackedShows.length > 0 && trackedShowsDetails.length === 0;
  const showSkeleton = isLoading || isLoadingShowDetails;
  const content = showSkeleton ? (
    <ManageSkeleton />
  ) : isNoTrackedShows ? (
    <NoTrackedShowsMessage />
  ) : (
    <TrackingList />
  );

  return (
    <>
      <title>Manage | TV Minder</title>
      <Box m="0 auto 30px" maxW="1170px" w={isMobile ? '100%' : '90%'}>
        {content}
      </Box>
    </>
  );
};
