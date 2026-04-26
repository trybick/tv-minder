import {
  Box,
  Button,
  EmptyState,
  Flex,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuTv } from 'react-icons/lu';

import { type ShowWatchProviders } from '~/store/tv/types/transformed';

import { ProviderChips } from './ProviderChips';

const COLLAPSED_HEIGHT = 120;

type Props = {
  showName: string;
  watchProviders: ShowWatchProviders | null;
};

export const WatchProviders = ({ showName, watchProviders }: Props) => {
  const tmdbWatchUrl = watchProviders?.link || 'https://www.themoviedb.org/';
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const contentElement = contentRef.current;

    if (!watchProviders || !contentElement) {
      queueMicrotask(() => {
        setIsOverflowing(false);
        setContentHeight(0);
      });
      return;
    }

    const check = () => {
      const nextHeight = contentElement.scrollHeight;
      setContentHeight(nextHeight);
      setIsOverflowing(nextHeight > COLLAPSED_HEIGHT + 1);
    };

    const observer = new ResizeObserver(check);
    observer.observe(contentElement);
    return () => observer.disconnect();
  }, [watchProviders]);

  return (
    <Box
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="xl"
      bg="whiteAlpha.50"
      p={4}
      display="flex"
      flexDirection="column"
      w="100%"
      h="100%"
      minH={{ md: '240px' }}
    >
      <Heading
        as="h3"
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="700"
        letterSpacing="-0.01em"
        mb={3}
      >
        Where to Watch
      </Heading>

      {!watchProviders ? (
        <EmptyState.Root size="sm" flex="1">
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuTv />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No streaming info available</EmptyState.Title>
              <EmptyState.Description>
                We don&apos;t have watch provider data for this show yet.
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <Flex direction="column" flex="1">
          <Box
            ref={contentRef}
            maxH={
              isOverflowing
                ? `${expanded ? contentHeight : COLLAPSED_HEIGHT}px`
                : undefined
            }
            overflow="hidden"
            position="relative"
            flex="1"
            transition={isOverflowing ? 'max-height 0.24s ease' : undefined}
            {...(!expanded && isOverflowing
              ? {
                  maskImage:
                    'linear-gradient(to bottom, black 70%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 70%, transparent 100%)',
                }
              : {})}
          >
            <Text color="fg.muted" fontSize="xs" mb={3}>
              Availability in {watchProviders.region}
            </Text>
            <Flex direction="column" gap={3}>
              {watchProviders.flatrate.length > 0 && (
                <Box>
                  <Text
                    fontSize="2xs"
                    color="fg.muted"
                    mb={1.5}
                    letterSpacing="widest"
                  >
                    Subscription
                  </Text>
                  <ProviderChips
                    providers={watchProviders.flatrate}
                    showName={showName}
                    tmdbWatchUrl={tmdbWatchUrl}
                  />
                </Box>
              )}
              {watchProviders.rent.length > 0 && (
                <Box>
                  <Text
                    fontSize="2xs"
                    color="fg.muted"
                    mb={1.5}
                    letterSpacing="widest"
                  >
                    Rent
                  </Text>
                  <ProviderChips
                    providers={watchProviders.rent}
                    showName={showName}
                    tmdbWatchUrl={tmdbWatchUrl}
                  />
                </Box>
              )}
              {watchProviders.buy.length > 0 && (
                <Box>
                  <Text
                    fontSize="2xs"
                    color="fg.muted"
                    mb={1.5}
                    letterSpacing="widest"
                  >
                    Buy
                  </Text>
                  <ProviderChips
                    providers={watchProviders.buy}
                    showName={showName}
                    tmdbWatchUrl={tmdbWatchUrl}
                  />
                </Box>
              )}
            </Flex>
            <Link
              display="inline-block"
              mt={3}
              color="cyan.300"
              fontSize="sm"
              href={tmdbWatchUrl}
              rel="noopener noreferrer"
              target="_blank"
              _hover={{ color: 'cyan.200' }}
            >
              See more options on JustWatch
            </Link>
          </Box>

          {isOverflowing && (
            <Button
              variant="plain"
              size="sm"
              color="fg.muted"
              w="100%"
              mt={2}
              _hover={{ color: 'fg' }}
              onClick={() => setExpanded(prev => !prev)}
            >
              {expanded ? 'Show less' : 'Show more'}
              <Icon
                as={LuChevronDown}
                boxSize="16px"
                ml={1}
                transition="transform 0.2s ease"
                transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}
              />
            </Button>
          )}
        </Flex>
      )}
    </Box>
  );
};
