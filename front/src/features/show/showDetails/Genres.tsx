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

  return (
    <Box mb={6}>
      {isMobile && id && <FollowButton showId={id} size="lg" w="100%" />}

      {isLoading || (!isLoading && genreNames?.length) ? (
        <DelayedSkeleton
          isLoading={isLoading}
          w={isLoading ? (isMobile ? '100%' : '200px') : 'auto'}
          mt={isMobile ? 3 : undefined}
        >
          <Flex gap={2} flexWrap="wrap" mt={isMobile ? 6 : undefined}>
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
