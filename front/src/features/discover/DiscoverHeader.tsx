import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { type ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export const DiscoverHeader = ({ icon, title, subtitle }: Props) => (
  <Flex align="center" gap={2.5} mb={3}>
    <Flex
      align="center"
      justify="center"
      w="34px"
      h="34px"
      borderRadius="lg"
      bg="cyan.500/15"
      color="cyan.400"
      fontSize="lg"
    >
      {icon}
    </Flex>

    <Box>
      <Heading
        as="h2"
        fontSize={{ base: 'lg', md: 'xl' }}
        fontWeight="700"
        color="fg"
      >
        {title}
      </Heading>

      <Text fontSize="xs" color="fg.muted" mt="1px">
        {subtitle}
      </Text>
    </Box>
  </Flex>
);
