import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { FiCalendar, FiHeart, FiSearch } from 'react-icons/fi';

const HOW_IT_WORKS_STEPS: { icon: ReactNode; label: string }[] = [
  { icon: <FiSearch />, label: 'Search shows' },
  { icon: <FiHeart />, label: 'Click Track' },
  { icon: <FiCalendar />, label: 'Track episodes' },
];

export const WelcomeHeroStrip = () => {
  return (
    <Box
      textAlign="center"
      mb={10}
      mt={2}
      mx="auto"
      px={6}
      py={6}
      borderWidth="1px"
      borderColor="whiteAlpha.300"
      borderRadius="xl"
      maxW="xl"
      position="relative"
    >
      <Heading
        as="h1"
        fontSize={{ base: 'xl', md: '2xl' }}
        fontWeight="700"
        letterSpacing="-0.03em"
        lineHeight="1.2"
        mb={3}
      >
        Your personal{' '}
        <Box as="span" color="cyan.400">
          TV episode calendar
        </Box>
      </Heading>
      <Text color="fg.muted" fontSize="sm" mb={6} maxW="400px" mx="auto">
        Track shows to get a personalized schedule of upcoming episodes
      </Text>
      <Flex justify="center" gap={2} flexWrap="wrap">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <Flex key={step.label} align="center" gap={2}>
            <Flex
              align="center"
              gap={2}
              px={3.5}
              py={2}
              borderRadius="full"
              bg="whiteAlpha.100"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              fontSize="xs"
              fontWeight="600"
              color="fg.default"
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
              <Text fontSize="xs" color="whiteAlpha.700">
                →
              </Text>
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
