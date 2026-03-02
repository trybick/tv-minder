import { Box, Flex, Tag } from '@chakra-ui/react';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show?: ShowForDisplay | null;
};

export const Genres = ({ show }: Props) => {
  const { isMobile } = useResponsiveLayout();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { genreNames } = show || {};

  if (!isLoading && !genreNames?.length) {
    return null;
  }

  return (
    <Box mb={5}>
      <DelayedSkeleton
        isLoading={isLoading}
        w={isLoading ? (isMobile ? '100%' : '200px') : 'auto'}
      >
        <Flex gap={2} flexWrap="wrap">
          {genreNames?.map(genre => (
            <Tag.Root
              key={genre}
              size="md"
              variant="subtle"
              bg="whiteAlpha.100"
              borderRadius="full"
              px={3}
              py={1}
            >
              <Tag.Label fontSize="xs" fontWeight="500" color="fg.muted">
                {genre}
              </Tag.Label>
            </Tag.Root>
          ))}
        </Flex>
      </DelayedSkeleton>
    </Box>
  );
};
