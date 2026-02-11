import { Box, Flex, Heading, Link, Text } from '@chakra-ui/react';

import { type ShowWatchProviders } from '~/store/tv/types/transformed';

import { ProviderChips } from './ProviderChips';

type Props = {
  watchProviders: ShowWatchProviders;
};

export const WatchProviders = ({ watchProviders }: Props) => {
  const tmdbWatchUrl = watchProviders.link || 'https://www.themoviedb.org/';

  return (
    <Box
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="xl"
      bg="whiteAlpha.50"
      p={4}
    >
      <Heading
        as="h3"
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="700"
        letterSpacing="-0.01em"
        mb={2}
      >
        Where to Watch
      </Heading>
      <Text color="fg.muted" fontSize="xs" mb={3}>
        Availability in {watchProviders.region}
      </Text>
      <Flex direction="column" gap={3}>
        {watchProviders.flatrate.length > 0 && (
          <Box>
            <Text fontSize="2xs" color="fg.muted" mb={1.5} letterSpacing="widest">
              Subscription
            </Text>
            <ProviderChips
              providers={watchProviders.flatrate}
              fallbackUrl={tmdbWatchUrl}
            />
          </Box>
        )}
        {watchProviders.rent.length > 0 && (
          <Box>
            <Text fontSize="2xs" color="fg.muted" mb={1.5} letterSpacing="widest">
              Rent
            </Text>
            <ProviderChips
              providers={watchProviders.rent}
              fallbackUrl={tmdbWatchUrl}
            />
          </Box>
        )}
        {watchProviders.buy.length > 0 && (
          <Box>
            <Text fontSize="2xs" color="fg.muted" mb={1.5} letterSpacing="widest">
              Buy
            </Text>
            <ProviderChips
              providers={watchProviders.buy}
              fallbackUrl={tmdbWatchUrl}
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
  );
};
