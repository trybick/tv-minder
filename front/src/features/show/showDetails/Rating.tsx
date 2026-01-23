import { Flex, Icon, Status, Text } from '@chakra-ui/react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';
import { abbreviateNumber } from '~/utils/formatting';

import { getStatusForDisplay } from './getStatusForDisplay';

type Props = {
  show?: ShowForDisplay | null;
};

export const Rating = ({ show }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { voteAverage, voteCount, status } = show || {};
  const statusForDisplay = getStatusForDisplay(status);

  return (
    <Flex align="center" gap={4} mb={5} flexWrap="wrap">
      {(isLoading || (!isLoading && voteAverage)) && (
        <DelayedSkeleton isLoading={isLoading} w="120px">
          <Flex align="center" gap={1.5}>
            <Icon as={FaStar} boxSize="16px" color="yellow.400" />
            <Text fontSize="md" fontWeight="700" color="fg">
              {voteAverage}
            </Text>
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
