import { Box, Separator } from '@chakra-ui/react';
import { useEffect } from 'react';
import { HiOutlineHeart } from 'react-icons/hi2';

import { Carousel } from '~/components/Carousel';
import { type ShowItem } from '~/components/ShowCard';
import { useAppDispatch, useAppSelector } from '~/store';
import { selectFollowedShows } from '~/store/rtk/slices/user.selectors';
import { fetchForYouShowsAction } from '~/store/tv/actions';
import { selectForYouShowsForDisplay } from '~/store/tv/selectors';

import { DiscoverHeader } from './DiscoverHeader';
import { DiscoverShowCard } from './DiscoverShowCard';

const keyExtractor = (show: ShowItem) => show.id;
const renderItem = (show: ShowItem) => <DiscoverShowCard show={show} />;

export const ForYouCarousel = () => {
  const dispatch = useAppDispatch();
  const followedShows = useAppSelector(selectFollowedShows);
  const forYouShows = useAppSelector(selectForYouShowsForDisplay);

  useEffect(() => {
    if (followedShows.length >= 2) {
      dispatch(fetchForYouShowsAction());
    }
  }, [dispatch, followedShows.length]);

  if (!forYouShows.length) {
    return null;
  }

  return (
    <Box id="discover-forYou">
      <Separator my={6} borderColor="whiteAlpha.200" />
      <DiscoverHeader
        icon={<HiOutlineHeart />}
        title="For You"
        subtitle="Recommended based on shows you follow"
      />
      <Carousel
        items={forYouShows}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </Box>
  );
};
