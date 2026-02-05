import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { type ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export const DiscoverHeader = ({ icon, title, subtitle }: Props) => (
  <Flex align="center" gap={3} mb={4}>
    <Flex
      align="center"
      justify="center"
      w="40px"
      h="40px"
      borderRadius="lg"
      bg="cyan.500/15"
      color="cyan.400"
      fontSize="xl"
    >
      {icon}
    </Flex>

    <Box>
      <Heading
        as="h2"
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="700"
        color="fg"
      >
        {title}
      </Heading>

      <Text fontSize="sm" color="fg.muted" mt="1px">
        {subtitle}
      </Text>
    </Box>
  </Flex>
);
