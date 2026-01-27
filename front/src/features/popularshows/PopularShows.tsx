import { Box, Flex, Heading, Separator, Text } from '@chakra-ui/react';
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

type SectionHeadingProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
};

const SectionHeading = ({ icon, title, subtitle }: SectionHeadingProps) => (
  <Flex align="center" gap={3} mb={5}>
    <Flex
      align="center"
      justify="center"
      w="40px"
      h="40px"
      borderRadius="lg"
      bg="cyan.500/15"
      color="cyan.400"
      fontSize="xl"
    >
      {icon}
    </Flex>
    <Box>
      <Heading as="h2" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="700" color="fg">
        {title}
      </Heading>
      {subtitle && (
        <Text fontSize="sm" color="fg.muted" mt="1px">
          {subtitle}
        </Text>
      )}
    </Box>
  </Flex>
);

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
