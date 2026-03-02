import { Box, Flex, Heading, Text } from '@chakra-ui/react';

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
  return { value: 'N/A', detail: null };
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

  return (
    <Box
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="xl"
      bg="whiteAlpha.50"
      p={5}
      mb={4}
    >
      <Heading
        as="h3"
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="700"
        letterSpacing="-0.01em"
        mb={4}
      >
        Recent Episodes
      </Heading>

      <Flex justify="space-around" gap={6} flexWrap="wrap">
        <Box>
          <Text fontSize="xs" color="fg.muted" mb={1.5} letterSpacing="widest">
            LAST AIRED
          </Text>
          {lastEpisodeAirDate ? (
            <>
              <Text fontSize="xl" fontWeight="bold" color="fg" opacity={0.9}>
                {formatAirDate(lastEpisodeAirDate)}
              </Text>
              <Text fontSize="sm" color="fg.muted" mt={1}>
                {dayjs(lastEpisodeAirDate).fromNow()}
              </Text>
            </>
          ) : (
            <>
              <Text fontSize="xl" fontWeight="bold" color="fg" opacity={0.5}>
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

        <Box>
          <Text fontSize="xs" color="fg.muted" mb={1.5} letterSpacing="widest">
            NEXT EPISODE
          </Text>
          {nextEpisodeAirDate ? (
            <>
              <Text fontSize="xl" fontWeight="bold" color="fg">
                {formatAirDate(nextEpisodeAirDate)}
              </Text>
              <Text fontSize="sm" color="fg.muted" fontWeight="medium" mt={1}>
                {formatRelativeText(nextEpisodeAirDate)}
              </Text>
            </>
          ) : (
            <>
              <Text fontSize="xl" fontWeight="bold" color="fg" opacity={0.5}>
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
      </Flex>
    </Box>
  );
};
