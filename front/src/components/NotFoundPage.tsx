import { Button, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import { FiHome } from 'react-icons/fi';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { PageContainer } from '~/components/PageContainer';

export const NotFoundPage = () => {
  const [, navigate] = useLocation();

  const handleGoHome = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(ROUTES.HOME);
  };

  return (
    <>
      <title>Page Not Found | TV Minder</title>
      <PageContainer py={{ base: 12, md: 16 }}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="50vh"
          gap={6}
          textAlign="center"
        >
          <Flex direction="column" align="center" gap={2}>
            <Heading
              as="h1"
              fontSize={{ base: '5xl', md: '6xl' }}
              fontWeight="bold"
              letterSpacing="tight"
              lineHeight="1"
              bgGradient="to-r"
              gradientFrom="cyan.300"
              gradientTo="cyan.500"
              bgClip="text"
            >
              404
            </Heading>
            <Heading
              as="h2"
              fontSize="xl"
              fontWeight="semibold"
              letterSpacing="tight"
              color="fg"
              mt={2}
            >
              Page not found
            </Heading>
            <Text color="fg.muted" fontSize="sm" maxW="360px" lineHeight="1.6">
              The page you&apos;re looking for doesn&apos;t exist or may have
              been moved.
            </Text>
          </Flex>

          <Button
            colorPalette="cyan"
            size="lg"
            rounded="lg"
            fontWeight="semibold"
            onClick={handleGoHome}
            px={8}
          >
            <Icon as={FiHome} />
            Back to Home
          </Button>
        </Flex>
      </PageContainer>
    </>
  );
};
