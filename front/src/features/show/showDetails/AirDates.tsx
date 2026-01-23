import { Flex, Grid, Icon, Stat } from '@chakra-ui/react';
import { HiOutlineCalendar } from 'react-icons/hi';

import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';
import { dayjs } from '~/utils/dayjs';

type Props = {
  show?: ShowForDisplay | null;
};

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

  return (
    <Grid gap={4} templateColumns={{ base: '1fr', sm: '1fr 1fr' }} mb={8}>
      {nextEpisodeAirDate && (
        <Stat.Root
          p={4}
          bg="whiteAlpha.100"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="whiteAlpha.300"
          boxShadow="sm"
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
            {dayjs(nextEpisodeAirDate).fromNow()}
          </Stat.HelpText>
        </Stat.Root>
      )}
      {lastEpisodeAirDate && (
        <Stat.Root
          p={4}
          bg="whiteAlpha.50"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="whiteAlpha.100"
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
    </Grid>
  );
};
