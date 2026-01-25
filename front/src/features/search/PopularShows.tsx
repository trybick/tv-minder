import { Box, Heading } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';

import { mapPopularShow } from '~/components/ShowCard';
import { ShowSection } from '~/features/popularshows/ShowSection';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  getPopularShowsAction,
  getTopRatedShowsAction,
} from '~/store/tv/actions';
import {
  selectPopularShowsForDisplay,
  selectTopRatedShowsForDisplay,
} from '~/store/tv/selectors';

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
    <Box m="18px 0 30px" maxW="1500px" w="95%">
      <Heading as="h2" color="fg.subtle" fontSize="2xl" fontWeight="700" mb={6}>
        Trending Now
      </Heading>
      <ShowSection shows={popularShowItems} />

      <Heading
        as="h2"
        color="fg.subtle"
        fontSize="2xl"
        fontWeight="700"
        mb={6}
        mt={6}
      >
        All-Time Favorites
      </Heading>
      <ShowSection shows={topRatedShowItems} />
    </Box>
  );
};
