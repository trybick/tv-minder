import { Box, Flex, Grid, Skeleton } from '@chakra-ui/react';

export const SearchResultsSkeleton = () => {
  return (
    <Box w="100%" maxW="1200px" px={{ base: '3', md: '6' }}>
      <Skeleton height="20px" width="80px" mb="4" ml="auto" />

      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        gap={{ base: '5', md: '6' }}
      >
        {[...Array(10)].map((_, index) => (
          <Flex key={index} direction="column">
            <Skeleton aspectRatio={2 / 3} w="100%" borderRadius="md" />
            <Flex direction="column" pt="3" gap="2">
              <Skeleton height="16px" width="80%" />
              <Skeleton height="12px" width="40px" />
              <Skeleton height="32px" width="100%" mt="1" />
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Box>
  );
};
