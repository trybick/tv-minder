import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { FiCalendar, FiHeart, FiSearch } from 'react-icons/fi';

const HOW_IT_WORKS_STEPS: { icon: ReactNode; label: string }[] = [
  { icon: <FiSearch />, label: 'Search shows' },
  { icon: <FiHeart />, label: 'Click Track' },
  { icon: <FiCalendar />, label: 'View calendar' },
];

export const WelcomeHeroStrip = () => {
  return (
    <Flex
      direction="column"
      mx="auto"
      maxW="1500px"
      px={{ base: 0, md: 6 }}
      w={{ base: '95%', sm: 'sm', md: 'md', lg: 'lg' }}
    >
      <Box
        textAlign="center"
        mb={6}
        mt={2}
        px={5}
        py={4}
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        borderRadius="lg"
        bg="whiteAlpha.50"
        position="relative"
        w="full"
      >
      <Heading
        as="h1"
        fontSize="md"
        fontWeight="700"
        letterSpacing="-0.02em"
        lineHeight="1.3"
        mb={1}
      >
        Your personal{' '}
        <Box as="span" color="cyan.400">
          TV episode calendar
        </Box>
      </Heading>
      <Text color="fg.muted" fontSize="xs" mb={3} maxW="320px" mx="auto">
        Track shows and get a personalized schedule of upcoming episodes
      </Text>
      <Flex justify="center" align="center" gap={1.5} flexWrap="wrap">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <Flex key={step.label} align="center" gap={1.5}>
            <Flex
              align="center"
              gap={1.5}
              fontSize="xs"
              fontWeight="600"
              color="fg.muted"
            >
              <Box
                color="cyan.400"
                display="flex"
                alignItems="center"
                fontSize="sm"
              >
                {step.icon}
              </Box>
              {step.label}
            </Flex>
            {index < HOW_IT_WORKS_STEPS.length - 1 && (
              <Text fontSize="xs" color="whiteAlpha.500">
                →
              </Text>
            )}
          </Flex>
        ))}
      </Flex>
      </Box>
    </Flex>
  );
};
