import { Box, Flex, Text } from '@chakra-ui/react';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';
import { abbreviateNumber } from '~/utils/formatting';

type Props = {
  show?: ShowForDisplay | null;
};

const getLetterGrade = (rating: number) => {
  if (rating >= 8.5) {
    return 'A';
  }

  if (rating >= 7.5) {
    return 'B';
  }

  if (rating >= 6.5) {
    return 'C';
  }

  if (rating >= 5.5) {
    return 'D';
  }

  return 'F';
};

const getRatingDisplay = (voteAverage?: ShowForDisplay['voteAverage']) => {
  const rating = voteAverage === undefined ? undefined : Number(voteAverage);

  if (rating === undefined || Number.isNaN(rating)) {
    return null;
  }

  return {
    letterGrade: getLetterGrade(rating),
    ratingForDisplay: `${rating.toFixed(1)} / 10`,
  };
};

const getPeopleWatchedDisplay = (voteCount?: ShowForDisplay['voteCount']) => {
  const count = voteCount ?? 0;

  return `${abbreviateNumber(count)} fans`;
};

export const RatingRow = ({ show }: Props) => {
  const { voteAverage, voteCount } = show || {};

  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  const ratingDisplay = getRatingDisplay(voteAverage);
  const peopleWatchedDisplay = getPeopleWatchedDisplay(voteCount);

  return (
    <Flex align="center" gap={3} mb={4} flexWrap="wrap">
      {(isLoading || (!isLoading && ratingDisplay)) && (
        <DelayedSkeleton
          isLoading={isLoading}
          w={{ base: '290px', md: '320px' }}
        >
          <Flex align="center" gap={3}>
            <Text
              fontSize={{ base: '4xl', md: '5xl' }}
              fontWeight="800"
              lineHeight="0.95"
              color="cyan.300"
              letterSpacing="-0.02em"
            >
              {ratingDisplay?.letterGrade}
            </Text>
            <Box>
              <Text
                fontSize={{ base: 'xl', md: 'xl' }}
                lineHeight="1.1"
                color="fg"
                fontWeight="700"
              >
                {ratingDisplay?.ratingForDisplay}
              </Text>
              <Text mt={1} color="fg.muted" fontSize="xs">
                {peopleWatchedDisplay}
              </Text>
            </Box>
          </Flex>
        </DelayedSkeleton>
      )}
    </Flex>
  );
};
