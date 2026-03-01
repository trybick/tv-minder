import { chakra, Flex, Heading } from '@chakra-ui/react';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show?: ShowForDisplay | null;
};

export const TitleRow = ({ show }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { name, startYear } = show || {};

  return (
    <Flex align="flex-start" wrap="nowrap" gap={4} mb={3}>
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
    </Flex>
  );
};
