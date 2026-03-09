import { Box, Flex, Grid, Skeleton } from '@chakra-ui/react';

import { showCardTemplateColumns } from '~/components/ShowCard/Grid';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';

const TAB_COUNT = 5;
const CARD_COUNT = 10;

const TabBarSkeleton = () => (
  <Flex justify="center" gap={2} mb={6} flexWrap="wrap">
    {[...Array(TAB_COUNT)].map((_, i) => (
      <Skeleton
        key={i}
        h="36px"
        w={i === 0 ? '60px' : '100px'}
        borderRadius="md"
      />
    ))}
  </Flex>
);

const CardGridSkeleton = () => (
  <Grid templateColumns={showCardTemplateColumns} gap={{ base: '3', md: '5' }}>
    {[...Array(CARD_COUNT)].map((_, i) => (
      <Flex key={i} direction="column">
        <Skeleton aspectRatio={2 / 3} w="100%" borderRadius="md" />
        <Flex direction="column" pt="3" gap="2">
          <Skeleton height="16px" width="80%" />
          <Skeleton height="12px" width="40px" />
          <Box height="32px" width="100%" mt="1" />
        </Flex>
      </Flex>
    ))}
  </Grid>
);

export const ManageSkeleton = () => {
  const { isMobile } = useResponsiveLayout();

  return (
    <Box mt={isMobile ? '20px' : '32px'} px={isMobile ? '10px' : 'unset'}>
      <TabBarSkeleton />
      <CardGridSkeleton />
    </Box>
  );
};
