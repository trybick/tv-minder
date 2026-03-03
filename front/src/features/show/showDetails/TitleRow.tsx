import { chakra, Flex, Heading, Status, Text } from '@chakra-ui/react';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

import { getStatusForDisplay } from './getStatusForDisplay';

type Props = {
  show?: ShowForDisplay | null;
};

export const TitleRow = ({ show }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { name, startYear, status } = show || {};
  const statusForDisplay = getStatusForDisplay(status);

  return (
    <Flex
      align="flex-start"
      justify="space-between"
      wrap="nowrap"
      gap={4}
      mb={3}
    >
      <DelayedSkeleton
        isLoading={isLoading}
        w={isLoading ? '280px' : 'auto'}
        h={isLoading ? '36px' : 'auto'}
        flex="1 1 auto"
        minW={0}
      >
        <Heading
          as="h1"
          fontSize={{ base: '2xl', md: '3xl' }}
          wordBreak="break-word"
        >
          {name}{' '}
          {startYear && (
            <chakra.span
              color="fg.muted"
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="400"
              whiteSpace="nowrap"
            >
              ({startYear})
            </chakra.span>
          )}
        </Heading>
      </DelayedSkeleton>
      {statusForDisplay && !isLoading && (
        <Status.Root
          colorPalette={statusForDisplay.color}
          size="md"
          px={3}
          py={1}
          borderRadius="full"
          flexShrink={0}
          mt={1}
        >
          <Status.Indicator />
          <Text fontSize="sm" fontWeight="bold" letterSpacing="wider">
            {statusForDisplay.label}
          </Text>
        </Status.Root>
      )}
    </Flex>
  );
};
