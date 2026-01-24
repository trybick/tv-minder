import { Box, Flex, Icon, Status, Text } from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';
import { abbreviateNumber } from '~/utils/formatting';

import { getStatusForDisplay } from './getStatusForDisplay';

type Props = {
  show?: ShowForDisplay | null;
};

const getRatingDisplay = (voteAverage?: ShowForDisplay['voteAverage']) => {
  const rating = voteAverage === undefined ? undefined : Number(voteAverage);

  if (rating === undefined || Number.isNaN(rating)) {
    return null;
  }

  const ratingColor =
    rating >= 8 ? 'green.500' : rating >= 6 ? 'yellow.500' : 'red.500';

  return { ratingForDisplay: rating.toFixed(1), ratingColor };
};

/**
 * Rating with star/vote count and show status.
 */
export const RatingRow = ({ show }: Props) => {
  const { voteAverage, voteCount, status } = show || {};

  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const statusForDisplay = getStatusForDisplay(status);

  const ratingDisplay = getRatingDisplay(voteAverage);

  return (
    <Flex align="center" gap={4} mb={5} flexWrap="wrap">
      {(isLoading || (!isLoading && ratingDisplay?.ratingForDisplay)) && (
        <DelayedSkeleton isLoading={isLoading} w="120px">
          <Flex align="center" gap={1.5}>
            <Box
              bg={ratingDisplay?.ratingColor}
              color="white"
              fontSize="sm"
              fontWeight="bold"
              px="2"
              py="1"
              borderRadius="md"
              letterSpacing="0.2px"
            >
              {ratingDisplay?.ratingForDisplay}
            </Box>
            <Flex align="center" gap={1} color="fg.muted" ml={1}>
              <Icon as={BsFillPersonFill} boxSize="14px" />
              <Text fontSize="xs">{abbreviateNumber(voteCount || 1)}</Text>
            </Flex>
          </Flex>
        </DelayedSkeleton>
      )}

      {statusForDisplay && !isLoading && (
        <Status.Root
          colorPalette={statusForDisplay.color}
          size="md"
          px={3}
          py={1}
          borderRadius="full"
          flexShrink={0}
        >
          <Status.Indicator />
          <Text fontSize="xs" fontWeight="bold" letterSpacing="wider">
            {statusForDisplay.label.toUpperCase()}
          </Text>
        </Status.Root>
      )}
    </Flex>
  );
};
