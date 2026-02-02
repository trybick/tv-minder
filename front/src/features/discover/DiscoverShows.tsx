import { Box, Separator } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { HiOutlineFire, HiOutlineStar } from 'react-icons/hi2';

import { mapPopularShow, type ShowItem } from '~/components/ShowCard';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  getPopularShowsAction,
  getTopRatedShowsAction,
} from '~/store/tv/actions';
import {
  selectPopularShowsForDisplay,
  selectTopRatedShowsForDisplay,
} from '~/store/tv/selectors';

import { Carousel } from './Carousel';
import { DiscoverHeader } from './DiscoverHeader';
import { DiscoverShowCard } from './DiscoverShowCard';

const keyExtractor = (show: ShowItem) => show.id;
const renderItem = (show: ShowItem) => <DiscoverShowCard show={show} />;

export const DiscoverShows = () => {
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
        <DiscoverHeader
          icon={<HiOutlineFire />}
          title="Trending Now"
          subtitle="What everyone's watching this week"
        />
        <Carousel
          items={popularShowItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </Box>

      <Separator my={10} borderColor="whiteAlpha.100" />

      <Box>
        <DiscoverHeader
          icon={<HiOutlineStar />}
          title="All-Time Favorites"
          subtitle="Highest rated shows of all time"
        />
        <Carousel
          items={topRatedShowItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </Box>
    </Box>
  );
};
