import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Separator,
  Text,
} from '@chakra-ui/react';
import { type MouseEvent } from 'react';
import { FaGithub, FaRegComment } from 'react-icons/fa';
import { useLocation } from 'wouter';

import TMDBLogo from '~/assets/images/TMDB-logo.svg';
import logo from '~/assets/images/logo.svg';
import { PageContainer } from '~/components/PageContainer';
import { useNavigationConfig } from '~/hooks/useNavigationConfig';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch } from '~/store';
import { setIsFeedbackModalOpen } from '~/store/rtk/slices/modals.slice';
import { dayjs } from '~/utils/dayjs';

export const Footer = () => {
  const dispatch = useAppDispatch();
  const { isMobile } = useResponsiveLayout();
  const [, navigate] = useLocation();
  const { visibleMainNavItems } = useNavigationConfig();

  const handleNavigate = (href: string) => (e: MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <Box mt="auto">
      <Separator borderColor="whiteAlpha.100" />

      <PageContainer py={8}>
        <Flex
          align={{ base: 'center', md: 'flex-start' }}
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 6, md: 0 }}
          justify="space-between"
        >
          <Flex
            align={{ base: 'center', md: 'flex-start' }}
            direction="column"
            gap={3}
          >
            <Image alt="TV Minder logo" h="18px" src={logo} />
            <Text
              color="fg.muted"
              fontSize="xs"
              maxW="260px"
              textAlign={{ base: 'center', md: 'left' }}
            >
              Track your favorite TV shows and never miss an episode.
            </Text>
          </Flex>

          {!isMobile && (
            <Flex direction="column" gap={2}>
              <Text
                color="fg.muted"
                fontSize="xs"
                fontWeight="600"
                letterSpacing="wider"
                mb={1}
                textTransform="uppercase"
              >
                Navigation
              </Text>
              {visibleMainNavItems.map(link => (
                <Link
                  key={link.id}
                  color="fg.muted"
                  fontSize="sm"
                  href={link.route}
                  onClick={handleNavigate(link.route)}
                  _hover={{ color: 'cyan.400' }}
                  transition="color 0.15s"
                >
                  {link.label}
                </Link>
              ))}
            </Flex>
          )}

          <Flex
            align={{ base: 'center', md: 'flex-start' }}
            direction="column"
            gap={3}
          >
            {!isMobile && (
              <Text
                color="fg.muted"
                fontSize="xs"
                fontWeight="600"
                letterSpacing="wider"
                mb={1}
                textTransform="uppercase"
              >
                Connect
              </Text>
            )}

            <Flex direction="column" gap={2}>
              <Link
                alignItems="center"
                color="fg.muted"
                display="flex"
                fontSize="sm"
                gap={2}
                href="https://github.com/trybick/tv-minder"
                rel="noopener noreferrer"
                target="_blank"
                _hover={{ color: 'cyan.400' }}
                transition="color 0.15s"
              >
                <Icon as={FaGithub} boxSize={4} />
                GitHub
              </Link>

              <Link
                as="button"
                type="button"
                alignItems="center"
                color="fg.muted"
                display="flex"
                fontSize="sm"
                gap={2}
                onClick={() => dispatch(setIsFeedbackModalOpen(true))}
                _hover={{ color: 'cyan.400', cursor: 'pointer' }}
                transition="color 0.15s"
              >
                <Icon as={FaRegComment} boxSize={4} />
                Share Feedback
              </Link>
            </Flex>
          </Flex>
        </Flex>

        <Separator borderColor="whiteAlpha.100" my={5} />

        <Flex
          align="center"
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 3, md: 0 }}
          justify="space-between"
        >
          <Flex alignItems="center" gap={2} opacity={0.6}>
            <Text fontSize="xs">Data provided by</Text>
            <Link
              href="https://www.themoviedb.org/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Image alt="The Movie DB logo" h="10px" src={TMDBLogo} />
            </Link>
          </Flex>

          <Text color="fg.muted" fontSize="xs" opacity={0.5}>
            &copy; {dayjs().year()} TV Minder
          </Text>
        </Flex>
      </PageContainer>
    </Box>
  );
};
