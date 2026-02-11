import { Flex, Image, Link, Text } from '@chakra-ui/react';

import { type ShowWatchProvider } from '~/store/tv/types/transformed';

const PROVIDER_LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w45';

const PROVIDER_DIRECT_LINKS: Record<string, string> = {
  'amazon video': 'https://www.primevideo.com/',
  'amazon prime video': 'https://www.primevideo.com/',
  'apple tv': 'https://tv.apple.com/',
  'apple tv plus': 'https://tv.apple.com/',
  'apple tv+': 'https://tv.apple.com/',
  'apple tv store': 'https://tv.apple.com/',
  'disney plus': 'https://www.disneyplus.com/',
  'disney+': 'https://www.disneyplus.com/',
  'fandango at home': 'https://www.vudu.com/',
  fubotv: 'https://www.fubo.tv/',
  'google play movies': 'https://play.google.com/store/movies',
  'hbo max': 'https://www.max.com/',
  hulu: 'https://www.hulu.com/',
  max: 'https://www.max.com/',
  netflix: 'https://www.netflix.com/',
  peacock: 'https://www.peacocktv.com/',
  'paramount plus': 'https://www.paramountplus.com/',
  'paramount+': 'https://www.paramountplus.com/',
  'youtube tv': 'https://tv.youtube.com/',
};

const getProviderLink = (providerName: string, fallbackUrl: string) => {
  const normalizedName = providerName.trim().toLowerCase();
  return PROVIDER_DIRECT_LINKS[normalizedName] ?? fallbackUrl;
};

type Props = {
  providers: ShowWatchProvider[];
  fallbackUrl: string;
};

export const ProviderChips = ({ providers, fallbackUrl }: Props) => {
  if (!providers.length) {
    return null;
  }

  return (
    <Flex gap={2} wrap="wrap">
      {providers.map(provider => (
        <Link
          key={provider.id}
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          borderRadius="full"
          px={2.5}
          py={1.5}
          bg="whiteAlpha.200"
          border="1px solid"
          borderColor="whiteAlpha.200"
          href={getProviderLink(provider.name, fallbackUrl)}
          rel="noopener noreferrer"
          target="_blank"
          _hover={{
            bg: 'whiteAlpha.300',
            borderColor: 'whiteAlpha.300',
            textDecoration: 'none',
          }}
        >
          {provider.logoPath && (
            <Image
              src={`${PROVIDER_LOGO_BASE_URL}${provider.logoPath}`}
              alt={provider.name}
              boxSize="18px"
              borderRadius="sm"
            />
          )}
          <Text fontSize="2xs" fontWeight="600" color="fg">
            {provider.name}
          </Text>
        </Link>
      ))}
    </Flex>
  );
};
