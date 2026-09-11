import { Box, Button, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { type MouseEvent, type ReactNode } from 'react';
import { FiCalendar, FiCompass, FiHeart, FiSearch } from 'react-icons/fi';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';

type Feature = { icon: ReactNode; title: string; description: string };

const FEATURES: Feature[] = [
  {
    icon: <FiSearch />,
    title: 'Search & Track',
    description: 'Find your favorite shows and track them',
  },
  {
    icon: <FiHeart />,
    title: 'Personalized',
    description: 'Only the shows you care about',
  },
  {
    icon: <FiCalendar />,
    title: 'Never Miss an Episode',
    description: 'See every premiere and new season at a glance',
  },
];

export const CalendarEmptyState = () => {
  const [, navigate] = useLocation();

  const handleDiscoverClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROUTES.HOME);
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      textAlign="center"
      py={{ base: 12, md: 16 }}
      px={6}
      gap={6}
    >
      <Box>
        <Heading
          as="h2"
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="bold"
          letterSpacing="tight"
          lineHeight="shorter"
          color="fg"
          mb={2}
        >
          Your personalized TV schedule
        </Heading>
        <Text color="fg.muted" fontSize={{ base: 'sm', md: 'md' }} maxW="400px">
          Track your favorite shows and see every upcoming episode here, all in
          one place.
        </Text>
      </Box>

      <Flex gap={3} flexWrap="wrap" justify="center" maxW="600px">
        {FEATURES.map(feature => (
          <Flex
            key={feature.title}
            direction="column"
            align="center"
            gap={3}
            px={4}
            py={5}
            rounded="2xl"
            bg="whiteAlpha.50"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
            flex={{ base: '1 1 150px', md: '1 1 170px' }}
            maxW="190px"
          >
            <Flex
              align="center"
              justify="center"
              boxSize="40px"
              rounded="full"
              bg="cyan.500/15"
              borderWidth="1px"
              borderColor="cyan.400/20"
              color="cyan.300"
              fontSize="lg"
            >
              {feature.icon}
            </Flex>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="fg" mb={0.5}>
                {feature.title}
              </Text>
              <Text fontSize="xs" color="fg.muted" lineHeight="1.5">
                {feature.description}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>

      <Button
        colorPalette="cyan"
        size="lg"
        rounded="lg"
        fontWeight="semibold"
        onClick={handleDiscoverClick}
        px={8}
      >
        <Icon as={FiCompass} />
        Discover Shows
      </Button>
    </Flex>
  );
};
