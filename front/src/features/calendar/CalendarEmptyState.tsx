import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { type MouseEvent, type ReactNode } from 'react';
import { FiCalendar, FiHeart, FiSearch } from 'react-icons/fi';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';

type Feature = { icon: ReactNode; title: string; description: string };

const FEATURES: Feature[] = [
  {
    icon: <FiSearch />,
    title: 'Search & Follow',
    description: 'Find your favorite shows and follow them',
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
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

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
      <Flex
        align="center"
        justify="center"
        w={{ base: '64px', md: '72px' }}
        h={{ base: '64px', md: '72px' }}
        borderRadius="2xl"
        bg="cyan.500/15"
        color="cyan.400"
        fontSize={{ base: '2xl', md: '3xl' }}
      >
        <FiCalendar />
      </Flex>

      <Box>
        <Heading
          as="h2"
          fontSize={{ base: 'xl', md: '2xl' }}
          fontWeight="800"
          letterSpacing="-0.02em"
          mb={2}
        >
          Your personalized TV schedule
        </Heading>
        <Text color="fg.muted" fontSize="sm" maxW="380px">
          Follow your favorite shows and see every upcoming episode here, all in
          one place.
        </Text>
      </Box>

      <Flex
        gap={3}
        flexWrap="wrap"
        justify="center"
        maxW="560px"
      >
        {FEATURES.map(feature => (
          <Flex
            key={feature.title}
            direction="column"
            align="center"
            gap={2}
            px={4}
            py={3.5}
            borderRadius="xl"
            bg="whiteAlpha.50"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
            flex={{ base: '1 1 140px', md: '1 1 160px' }}
            maxW="180px"
          >
            <Box color="cyan.400" fontSize="lg">
              {feature.icon}
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="600" mb={0.5}>
                {feature.title}
              </Text>
              <Text fontSize="xs" color="fg.muted" lineHeight="1.4">
                {feature.description}
              </Text>
            </Box>
          </Flex>
        ))}
      </Flex>

      <Flex direction="column" align="center" gap={2}>
        <Button
          colorPalette="cyan"
          size="md"
          onClick={handleDiscoverClick}
          px={6}
        >
          Discover Shows
        </Button>
        {!isLoggedIn && (
          <Text fontSize="xs" color="fg.subtle">
            Create an account to sync your shows across devices
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
