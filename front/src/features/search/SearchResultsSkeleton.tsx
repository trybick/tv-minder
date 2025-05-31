import { Box, Grid, Skeleton, Stack } from '@chakra-ui/react';

const SearchResultsSkeleton = () => {
  return (
    <Box m="0 auto">
      <Skeleton height="24px" width="100px" mb="24px" ml="auto" />

      <Stack gap={5} m="0 auto" w={{ base: '96%', md: '500px' }}>
        {[...Array(5)].map((_, index) => (
          <Box
            key={index}
            borderRadius="6px"
            borderWidth="1px"
            p="14px"
            shadow="md"
          >
            <Grid gap={4} templateColumns="100px 1fr">
              <Box w="100px">
                <Skeleton height="150px" borderRadius="6px" />
              </Box>

              <Box>
                <Skeleton height="24px" width="70%" mb="2" />
                <Skeleton height="20px" width="40px" mb="4" />
                <Skeleton height="80px" width="100%" />
              </Box>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default SearchResultsSkeleton;
