import { Flex, Heading, Image, Text } from '@chakra-ui/react';

import noResultsImage from '~/assets/images/no-results.png';

export const NoResultsFound = () => {
  return (
    <Flex direction="column" align="center" justify="center" minH="40vh">
      <Image
        src={noResultsImage}
        alt="No results found"
        boxSize="120px"
        opacity={0.7}
        mb="6"
      />

      <Heading as="h2" size="md" color="gray.700" mb="2">
        No results found
      </Heading>

      <Text color="gray.500" fontSize="lg" textAlign="center" maxW="300px">
        {`Try adjusting your search to find what you're looking for.`}
      </Text>
    </Flex>
  );
};
