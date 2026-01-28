import { Box, Flex, Grid, Skeleton } from '@chakra-ui/react';

import { showCardTemplateColumns } from '~/components/ShowCard/Grid';

export const SearchResultsSkeleton = () => {
  return (
    <Box w="100%" maxW="1200px" px={{ base: '3', md: '6' }}>
      <Skeleton height="20px" width="80px" mb="4" ml="auto" />

      <Grid
        templateColumns={showCardTemplateColumns}
        gap={{ base: '3', md: '4' }}
      >
        {[...Array(12)].map((_, index) => (
          <Flex key={index} direction="column">
            <Skeleton aspectRatio={2 / 3} w="100%" borderRadius="md" />
            <Flex direction="column" pt="3" gap="2">
              <Skeleton height="16px" width="80%" />
              <Skeleton height="12px" width="40px" />
              <Box height="32px" width="100%" mt="1" />
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
};
