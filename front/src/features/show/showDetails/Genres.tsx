import { Box, Flex, Tag } from '@chakra-ui/react';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { FollowButton } from '~/components/FollowButton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show?: ShowForDisplay | null;
};

export const Genres = ({ show }: Props) => {
  const isMobile = useIsMobile();

  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  const { id, genreNames } = show || {};

  return isMobile ? (
    <Box mb={6}>
      {id && <FollowButton showId={id} size="lg" w="100%" />}
      {isLoading || (!isLoading && genreNames?.length) ? (
        <DelayedSkeleton
          isLoading={isLoading}
          w={isLoading ? '100%' : 'auto'}
          mt={3}
        >
          <Flex gap={2} flexWrap="wrap" mt={isMobile ? 6 : 0}>
            {genreNames?.map(genre => (
              <Tag.Root
                key={genre}
                size="sm"
                variant="subtle"
                bg="whiteAlpha.100"
                borderRadius="full"
                px={2}
              >
                <Tag.Label fontSize="xs" fontWeight="500" color="fg.muted">
                  {genre}
                </Tag.Label>
              </Tag.Root>
            ))}
          </Flex>
        </DelayedSkeleton>
      ) : null}
    </Box>
  ) : (
    <Box mb={6}>
      {isLoading || (!isLoading && genreNames?.length) ? (
        <DelayedSkeleton isLoading={isLoading} w={isLoading ? '200px' : 'auto'}>
          <Flex gap={2} flexWrap="wrap">
            {genreNames?.map(genre => (
              <Tag.Root
                key={genre}
                size="sm"
                variant="subtle"
                bg="whiteAlpha.100"
                borderRadius="full"
                px={2}
              >
                <Tag.Label fontSize="xs" fontWeight="500" color="fg.muted">
                  {genre}
                </Tag.Label>
              </Tag.Root>
            ))}
          </Flex>
        </DelayedSkeleton>
      ) : null}
    </Box>
  );
};
