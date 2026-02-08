import { Box, Separator } from '@chakra-ui/react';
import { type ReactNode, useEffect } from 'react';
import { FaFighterJet } from 'react-icons/fa';
import { GiReturnArrow, GiSpaceship, GiTheaterCurtains } from 'react-icons/gi';
import {
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineFire,
  HiOutlineSignal,
  HiOutlineSparkles,
  HiOutlineStar,
} from 'react-icons/hi2';
import { MdOutlineMovie } from 'react-icons/md';
import { SiAppletv, SiHbo, SiNetflix } from 'react-icons/si';
import { TbBrandDisney } from 'react-icons/tb';

import { Carousel } from '~/components/Carousel';
import { type ShowItem } from '~/components/ShowCard';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  type DiscoverCarouselKey,
  fetchDiscoverShowsAction,
} from '~/store/tv/actions';
import { selectDiscoverShowsForDisplay } from '~/store/tv/selectors';

import { DiscoverHeader } from './DiscoverHeader';
import { DiscoverNav } from './DiscoverNav';
import { DiscoverShowCard } from './DiscoverShowCard';
import { ForYouCarousel } from './ForYouCarousel';
import { LazyCarouselSection } from './LazyCarouselSection';

export type CarouselConfig = {
  key: DiscoverCarouselKey;
  icon: ReactNode;
  title: string;
  subtitle: string;
};

const CAROUSEL_CONFIGS: CarouselConfig[] = [
  {
    key: 'trending',
    icon: <HiOutlineFire />,
    title: 'Trending Now',
    subtitle: "What everyone's watching this week",
  },
  {
    key: 'airingThisWeek',
    icon: <HiOutlineSignal />,
    title: 'Airing This Week',
    subtitle: 'New episodes from the past 7 days',
  },
  {
    key: 'newShows',
    icon: <HiOutlineSparkles />,
    title: 'Fresh & New',
    subtitle: 'Shows that premiered recently',
  },
  {
    key: 'comingSoon',
    icon: <HiOutlineCalendar />,
    title: 'Coming Soon',
    subtitle: 'Premiering in the next 30 days',
  },
  {
    key: 'returningThisMonth',
    icon: <GiReturnArrow />,
    title: 'Returning This Month',
    subtitle: 'Shows coming back with new seasons',
  },
  {
    key: 'mostRated',
    icon: <HiOutlineChartBar />,
    title: 'Most Rated',
    subtitle: 'Shows with the most reviews',
  },
  {
    key: 'highestRated',
    icon: <HiOutlineStar />,
    title: 'Highest Rated',
    subtitle: 'Top rated shows by viewers',
  },
  {
    key: 'action',
    icon: <FaFighterJet />,
    title: 'Action & Adventure',
    subtitle: 'Thrilling action-packed shows',
  },
  {
    key: 'drama',
    icon: <GiTheaterCurtains />,
    title: 'Drama',
    subtitle: 'Compelling dramatic series',
  },
  {
    key: 'sciFi',
    icon: <GiSpaceship />,
    title: 'Sci-Fi & Fantasy',
    subtitle: 'Explore new worlds and dimensions',
  },
  {
    key: 'documentary',
    icon: <MdOutlineMovie />,
    title: 'Documentary',
    subtitle: 'Real stories and fascinating facts',
  },
  {
    key: 'netflix',
    icon: <SiNetflix />,
    title: 'Netflix',
    subtitle: 'Popular shows on Netflix',
  },
  {
    key: 'hbo',
    icon: <SiHbo />,
    title: 'HBO / Max',
    subtitle: 'Premium HBO content',
  },
  {
    key: 'disney',
    icon: <TbBrandDisney />,
    title: 'Disney+',
    subtitle: 'Disney, Marvel, Star Wars & more',
  },
  {
    key: 'appleTv',
    icon: <SiAppletv />,
    title: 'Apple TV+',
    subtitle: 'Award-winning Apple originals',
  },
];

const keyExtractor = (show: ShowItem) => show.id;
const renderItem = (show: ShowItem) => <DiscoverShowCard show={show} />;

const EAGER_COUNT = 2;

export const DiscoverShows = () => {
  const dispatch = useAppDispatch();
  const discoverShows = useAppSelector(selectDiscoverShowsForDisplay);

  useEffect(() => {
    dispatch(fetchDiscoverShowsAction());
  }, [dispatch]);

  return (
    <Box maxW="1500px" w="95%" pt={2} pb={8}>
      <DiscoverNav items={CAROUSEL_CONFIGS} />
      <ForYouCarousel />
      {CAROUSEL_CONFIGS.map((config, index) =>
        index < EAGER_COUNT ? (
          <Box key={config.key} id={`discover-${config.key}`}>
            {index > 0 && <Separator my={6} borderColor="whiteAlpha.200" />}
            <DiscoverHeader
              icon={config.icon}
              title={config.title}
              subtitle={config.subtitle}
            />
            <Carousel
              items={discoverShows[config.key]}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
            />
          </Box>
        ) : (
          <LazyCarouselSection
            key={config.key}
            config={config}
            items={discoverShows[config.key]}
            index={index}
          />
        )
      )}
    </Box>
  );
};
