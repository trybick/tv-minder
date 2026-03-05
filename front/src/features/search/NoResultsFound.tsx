import { Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

export const NoResultsFound = () => {
  return (
    <Flex direction="column" align="center" justify="center" minH="40vh" gap={4}>
      <Flex
        align="center"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="full"
        h="72px"
        justify="center"
        w="72px"
      >
        <Icon as={FiSearch} boxSize={7} color="fg.muted" opacity={0.5} />
      </Flex>

      <Flex align="center" direction="column" gap={1.5}>
        <Heading as="h2" fontSize="lg" color="fg">
          No results found
        </Heading>

        <Text color="fg.muted" fontSize="sm" textAlign="center" maxW="280px" lineHeight="1.5">
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </Text>
      </Flex>
    </Flex>
  );
};
