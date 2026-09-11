import { Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

export const NoResultsFound = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="40vh"
      gap={4}
    >
      <Flex
        align="center"
        bg="cyan.500/15"
        borderWidth="1px"
        borderColor="cyan.400/20"
        rounded="full"
        boxSize="64px"
        justify="center"
      >
        <Icon as={FiSearch} boxSize={6} color="cyan.300" />
      </Flex>

      <Flex align="center" direction="column" gap={1.5}>
        <Heading
          as="h2"
          fontSize="xl"
          fontWeight="semibold"
          letterSpacing="tight"
          color="fg"
        >
          No results found
        </Heading>

        <Text
          color="fg.muted"
          fontSize="sm"
          textAlign="center"
          maxW="280px"
          lineHeight="1.5"
        >
          Try adjusting your search or filters to find what you&apos;re looking
          for.
        </Text>
      </Flex>
    </Flex>
  );
};
