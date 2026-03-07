import { Button, Flex, Icon, Image, Link, Text } from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import { FiCompass, FiHeart } from 'react-icons/fi';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import noShowsImage from '~/assets/images/tv-remote.jpg';

export const NoTrackedShowsMessage = () => {
  const [, navigate] = useLocation();

  const handleClickHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(ROUTES.HOME);
  };

  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      gap={5}
      m="50px auto 0"
      maxW="420px"
      px={4}
    >
      <Image
        borderRadius="xl"
        h="240px"
        objectFit="cover"
        src={noShowsImage}
        w="100%"
        opacity={0.85}
      />

      <Flex
        align="center"
        bg="cyan.500/10"
        borderRadius="full"
        h="56px"
        justify="center"
        w="56px"
      >
        <Icon as={FiHeart} boxSize={6} color="cyan.400" />
      </Flex>

      <Flex align="center" direction="column" gap={1.5}>
        <Text color="fg" fontSize="lg" fontWeight="600">
          No tracked shows yet
        </Text>
        <Text
          color="fg.muted"
          fontSize="sm"
          lineHeight="1.6"
          maxW="320px"
          textAlign="center"
        >
          Shows you track will appear here. Track shows to see upcoming episodes
          on your calendar.
        </Text>
      </Flex>

      <Link href={ROUTES.HOME} onClick={handleClickHome}>
        <Button colorPalette="cyan" size="md" mt={1}>
          <Icon as={FiCompass} />
          Discover Shows
        </Button>
      </Link>
    </Flex>
  );
};
