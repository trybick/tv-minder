import { Box, Separator } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { HiOutlineFire, HiOutlineStar } from 'react-icons/hi2';

import { mapPopularShow } from '~/components/ShowCard';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  getPopularShowsAction,
  getTopRatedShowsAction,
} from '~/store/tv/actions';
import {
  selectPopularShowsForDisplay,
  selectTopRatedShowsForDisplay,
} from '~/store/tv/selectors';

import { PopularShowSection } from './PopularShowSection';
import { SectionHeading } from './SectionHeading';

export const PopularShows = () => {
  const dispatch = useAppDispatch();
  const popularShows = useAppSelector(selectPopularShowsForDisplay);
  const topRatedShows = useAppSelector(selectTopRatedShowsForDisplay);

  useEffect(() => {
    dispatch(getPopularShowsAction());
    dispatch(getTopRatedShowsAction());
  }, [dispatch]);

  const popularShowItems = useMemo(
    () => popularShows?.map(mapPopularShow) ?? [],
    [popularShows]
  );
  const topRatedShowItems = useMemo(
    () => topRatedShows?.map(mapPopularShow) ?? [],
    [topRatedShows]
  );

  return (
    <Box maxW="1500px" w="95%" pt={2} pb={8}>
      <Box>
        <SectionHeading
          icon={<HiOutlineFire />}
          title="Trending Now"
          subtitle="What everyone's watching this week"
        />
        <PopularShowSection shows={popularShowItems} />
      </Box>

      <Separator my={10} borderColor="whiteAlpha.100" />

      <Box>
        <SectionHeading
          icon={<HiOutlineStar />}
          title="All-Time Favorites"
          subtitle="Highest rated shows of all time"
        />
        <PopularShowSection shows={topRatedShowItems} />
      </Box>
    </Box>
  );
};
