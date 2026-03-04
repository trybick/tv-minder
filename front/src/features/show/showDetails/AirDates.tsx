import { Badge, Box, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { FiClock, FiZap } from 'react-icons/fi';

import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';
import { dayjs } from '~/utils/dayjs';

type Props = {
  show?: ShowForDisplay | null;
};

const getEmptyNextEpisodeText = (status?: ShowForDisplay['status']) => {
  if (status?.isEnded) {
    return { value: 'N/A', detail: 'Ended' };
  }
  if (status?.isInProduction) {
    return { value: 'Not Announced Yet', detail: 'In Production' };
  }
  return { value: 'Not Announced Yet', detail: null };
};

const getEmptyLastAiredText = (status?: ShowForDisplay['status']) => {
  if (status?.isEnded) {
    return { value: 'N/A', detail: 'Ended' };
  }
  return { value: 'N/A', detail: 'Has not aired yet' };
};

export const AirDates = ({ show }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { lastEpisodeAirDate, nextEpisodeAirDate, status } = show || {};

  if (isLoading) {
    return null;
  }

  const formatAirDate = (date: string) => {
    const dateObj = dayjs(date);
    const isCurrentYear = dateObj.isSame(dayjs(), 'year');
    return dateObj.format(isCurrentYear ? 'MMM D' : 'MMM D, YYYY');
  };

  const formatRelativeText = (date: string) => {
    const dateObj = dayjs(date);
    const now = dayjs();

    if (dateObj.isBefore(now) && dateObj.isSame(now, 'day')) {
      return 'Today';
    }

    return dateObj.fromNow();
  };

  const emptyNext = getEmptyNextEpisodeText(status);
  const emptyLast = getEmptyLastAiredText(status);
  const now = dayjs().startOf('day');

  const isLastEpisodeRecent = lastEpisodeAirDate
    ? now.diff(dayjs(lastEpisodeAirDate).startOf('day'), 'day') <= 21 &&
      !dayjs(lastEpisodeAirDate).isAfter(now, 'day')
    : false;

  const isNextEpisodeSoon = nextEpisodeAirDate
    ? !dayjs(nextEpisodeAirDate).isBefore(now, 'day') &&
      dayjs(nextEpisodeAirDate).startOf('day').diff(now, 'day') <= 21
    : false;

  const cardStyles = {
    border: '1px solid',
    borderColor: 'whiteAlpha.100',
    borderRadius: 'xl',
    bg: 'whiteAlpha.50',
    p: 5,
    minW: 0,
    alignSelf: 'stretch',
  } as const;

  return (
    <>
      <Box {...cardStyles}>
        <Flex align="center" gap={2} mb={3}>
          <Heading
            as="h3"
            fontSize="sm"
            fontWeight="600"
            color="fg.muted"
            letterSpacing="widest"
            textTransform="uppercase"
          >
            Last Aired
          </Heading>
          {isLastEpisodeRecent && (
            <Badge
              variant="subtle"
              colorPalette="orange"
              size="md"
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FiClock} boxSize={3} />
              Recent
            </Badge>
          )}
        </Flex>
        {lastEpisodeAirDate ? (
          <>
            <Text fontSize="xl" fontWeight="700" color="fg" lineHeight="1.2">
              {formatAirDate(lastEpisodeAirDate)}
            </Text>
            <Text fontSize="sm" color="fg.muted" mt={1}>
              {dayjs(lastEpisodeAirDate).fromNow()}
            </Text>
          </>
        ) : (
          <>
            <Text
              fontSize="xl"
              fontWeight="700"
              color="fg"
              opacity={0.4}
              lineHeight="1.2"
            >
              {emptyLast.value}
            </Text>
            {emptyLast.detail && (
              <Text fontSize="sm" color="fg.muted" mt={1}>
                {emptyLast.detail}
              </Text>
            )}
          </>
        )}
      </Box>

      <Box {...cardStyles}>
        <Flex align="center" gap={2} mb={3}>
          <Heading
            as="h3"
            fontSize="sm"
            fontWeight="600"
            color="fg.muted"
            letterSpacing="widest"
            textTransform="uppercase"
          >
            Next Episode
          </Heading>
          {isNextEpisodeSoon && (
            <Badge
              variant="subtle"
              colorPalette="green"
              size="md"
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Icon as={FiZap} boxSize={3} />
              Soon
            </Badge>
          )}
        </Flex>
        {nextEpisodeAirDate ? (
          <>
            <Text fontSize="xl" fontWeight="700" color="fg" lineHeight="1.2">
              {formatAirDate(nextEpisodeAirDate)}
            </Text>
            <Text fontSize="sm" color="fg.muted" fontWeight="medium" mt={1}>
              {formatRelativeText(nextEpisodeAirDate)}
            </Text>
          </>
        ) : (
          <>
            <Text
              fontSize="xl"
              fontWeight="700"
              color="fg"
              opacity={0.4}
              lineHeight="1.2"
            >
              {emptyNext.value}
            </Text>
            {emptyNext.detail && (
              <Text fontSize="sm" color="fg.muted" mt={1}>
                {emptyNext.detail}
              </Text>
            )}
          </>
        )}
      </Box>
    </>
  );
};
