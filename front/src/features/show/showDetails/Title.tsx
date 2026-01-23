import { chakra, Flex, Heading } from '@chakra-ui/react';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { VideoTrailerButton } from '~/features/show/VideoTrailerButton';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show?: ShowForDisplay | null;
};

export const Title = ({ show }: Props) => {
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { name, yearsActive, videoTrailerKey } = show || {};

  return (
    <Flex
      justify="space-between"
      align="flex-start"
      wrap="nowrap"
      gap={4}
      mb={3}
    >
      <DelayedSkeleton
        isLoading={isLoading}
        w={isLoading ? '280px' : 'auto'}
        h={isLoading ? '36px' : 'auto'}
      >
        <Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }}>
          {name}
          {yearsActive && (
            <chakra.span
              color="fg.muted"
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="400"
              ml={2}
            >
              ({yearsActive})
            </chakra.span>
          )}
        </Heading>
      </DelayedSkeleton>

      <VideoTrailerButton videoId={videoTrailerKey} />
    </Flex>
  );
};
