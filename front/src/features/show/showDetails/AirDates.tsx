import { Flex, Grid, Icon, Stat } from '@chakra-ui/react';
import { HiOutlineCalendar } from 'react-icons/hi';

import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';
import { dayjs } from '~/utils/dayjs';

type Props = {
  show?: ShowForDisplay | null;
};

/**
 * Renders next/last episode air date cards.
 * Mobile stacks cards; desktop uses two columns.
 * */
export const AirDates = ({ show }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { lastEpisodeAirDate, nextEpisodeAirDate } = show || {};
  const hasAirDates = lastEpisodeAirDate || nextEpisodeAirDate;

  if (isLoading || !hasAirDates) {
    return null;
  }

  const formatAirDate = (date: string) => {
    const dateObj = dayjs(date);
    const isCurrentYear = dateObj.isSame(dayjs(), 'year');
    return dateObj.format(isCurrentYear ? 'MMM D' : 'MMM D, YYYY');
  };

  const formatNextEpisodeRelativeText = (date: string) => {
    const dateObj = dayjs(date);
    const now = dayjs();

    if (dateObj.isBefore(now) && dateObj.isSame(now, 'day')) {
      return 'Today';
    }

    return dateObj.fromNow();
  };

  return (
    <Grid
      gap={4}
      mb={{ base: 5, md: 7 }}
      templateColumns={{ base: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }}
      alignItems="stretch"
    >
      {lastEpisodeAirDate && (
        <Stat.Root
          p={4}
          bg="whiteAlpha.50"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="whiteAlpha.100"
          w="100%"
          order={{ base: 2, sm: 1 }}
        >
          <Stat.Label color="fg.muted" fontWeight="medium">
            Last Aired
          </Stat.Label>
          <Stat.ValueText
            color="fg.muted"
            fontSize="xl"
            fontWeight="bold"
            opacity={0.8}
          >
            {formatAirDate(lastEpisodeAirDate)}
          </Stat.ValueText>
          <Stat.HelpText color="fg.muted">
            {dayjs(lastEpisodeAirDate).fromNow()}
          </Stat.HelpText>
        </Stat.Root>
      )}
      {nextEpisodeAirDate && (
        <Stat.Root
          p={4}
          bg="whiteAlpha.100"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
          boxShadow="sm"
          w="100%"
          order={{ base: 1, sm: 2 }}
        >
          <Flex align="center" gap={2} mb={1}>
            <Icon as={HiOutlineCalendar} color="cyan.600" boxSize="16px" />
            <Stat.Label color="fg.muted" fontWeight="semibold">
              Next Episode
            </Stat.Label>
          </Flex>
          <Stat.ValueText color="fg.muted" fontSize="xl" fontWeight="bold">
            {formatAirDate(nextEpisodeAirDate)}
          </Stat.ValueText>
          <Stat.HelpText color="cyan.600" fontWeight="semibold">
            {formatNextEpisodeRelativeText(nextEpisodeAirDate)}
          </Stat.HelpText>
        </Stat.Root>
      )}
    </Grid>
  );
};
