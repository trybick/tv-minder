import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { LuUsers } from 'react-icons/lu';

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

  const starsOutOf5 = (rating / 10) * 5;
  const fullStars = Math.floor(starsOutOf5);
  const hasHalfStar = starsOutOf5 % 1 >= 0.25 && starsOutOf5 % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return {
    letterGrade: getLetterGrade(rating),
    ratingNumber: rating.toFixed(1),
    ratingSuffix: '/ 10',
    fullStars,
    hasHalfStar,
    emptyStars,
  };
};

const StarRating = ({
  fullStars,
  hasHalfStar,
  emptyStars,
}: {
  fullStars: number;
  hasHalfStar: boolean;
  emptyStars: number;
}) => (
  <Flex align="center" gap={0.5} color="yellow.400">
    {Array.from({ length: fullStars }).map((_, i) => (
      <Icon key={`full-${i}`} as={FaStar} boxSize={3} />
    ))}
    {hasHalfStar && <Icon as={FaStarHalfAlt} boxSize={3} />}
    {Array.from({ length: emptyStars }).map((_, i) => (
      <Icon key={`empty-${i}`} as={FaRegStar} boxSize={3} />
    ))}
  </Flex>
);

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
              <Flex align="baseline" gap={1}>
                <Text
                  fontSize={{ base: 'xl', md: 'xl' }}
                  lineHeight="1.1"
                  color="fg"
                  fontWeight="700"
                >
                  {ratingDisplay?.ratingNumber}
                </Text>
                <Text
                  fontSize="sm"
                  lineHeight="1.1"
                  color="fg"
                  fontWeight="500"
                >
                  {ratingDisplay?.ratingSuffix}
                </Text>
              </Flex>
              <Box mt={1}>
                <StarRating
                  fullStars={ratingDisplay?.fullStars ?? 0}
                  hasHalfStar={!!ratingDisplay?.hasHalfStar}
                  emptyStars={ratingDisplay?.emptyStars ?? 5}
                />
              </Box>
              <Flex
                mt={1}
                align="center"
                gap={1.5}
                color="fg.muted"
                fontSize="xs"
              >
                <Box as={LuUsers} boxSize={3.5} display="inline-block" />
                <Text>{peopleWatchedDisplay}</Text>
              </Flex>
            </Box>
          </Flex>
        </DelayedSkeleton>
      )}
    </Flex>
  );
};
