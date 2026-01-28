import { Box, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import { FiCalendar, FiHeart, FiSearch } from 'react-icons/fi';

const steps = [
  {
    icon: <FiSearch />,
    title: 'Find Shows',
    description: 'Search for your favorite TV shows or browse trending titles',
  },
  {
    icon: <FiHeart />,
    title: 'Follow Them',
    description: 'Click the follow button to add shows to your watchlist',
  },
  {
    icon: <FiCalendar />,
    title: 'Track Episodes',
    description: 'See upcoming episodes in your personalized calendar',
  },
];

export const HowItWorks = () => (
  <Box
    bg="whiteAlpha.50"
    borderRadius="xl"
    p={{ base: 5, md: 6 }}
    mb={10}
    borderWidth="1px"
    borderColor="whiteAlpha.100"
  >
    <Heading
      as="h2"
      fontSize={{ base: 'lg', md: 'xl' }}
      fontWeight="600"
      mb={5}
      textAlign="center"
      color="fg"
    >
      How It Works
    </Heading>

    <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: 4, md: 6 }}>
      {steps.map((step, index) => (
        <Flex
          key={index}
          direction="column"
          align="center"
          textAlign="center"
          gap={2}
        >
          <Flex
            align="center"
            justify="center"
            w="48px"
            h="48px"
            borderRadius="full"
            bg="cyan.500/15"
            color="cyan.400"
            fontSize="xl"
          >
            {step.icon}
          </Flex>

          <Text fontWeight="600" color="fg">
            {step.title}
          </Text>

          <Text fontSize="sm" color="fg.muted" lineHeight="short">
            {step.description}
          </Text>
        </Flex>
      ))}
    </SimpleGrid>
  </Box>
);
