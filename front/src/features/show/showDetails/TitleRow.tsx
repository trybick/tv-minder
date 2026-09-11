import { chakra, Flex, Heading, Status, Text } from '@chakra-ui/react';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

import { getStatusForDisplay } from './getStatusForDisplay';

type Props = {
  show?: ShowForDisplay | null;
  fallbackName?: string;
};

export const TitleRow = ({ show, fallbackName }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { name: showName, startYear, status } = show || {};
  const name = showName || fallbackName;
  const isTitleLoading = isLoading && !name;
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
        isLoading={isTitleLoading}
        w={isTitleLoading ? '280px' : 'auto'}
        h={isTitleLoading ? '36px' : 'auto'}
        flex="1 1 auto"
        minW={0}
      >
        <Heading
          as="h1"
          fontSize={{ base: '2xl', md: '3xl' }}
          letterSpacing="tight"
          color="fg"
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
          mt={1}
          flexShrink={0}
        >
          <Status.Indicator />
          <Text
            fontSize="sm"
            fontWeight="bold"
            letterSpacing="wider"
            whiteSpace="nowrap"
          >
            {statusForDisplay.label}
          </Text>
        </Status.Root>
      )}
    </Flex>
  );
};
