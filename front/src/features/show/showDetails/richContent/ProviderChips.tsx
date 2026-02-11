import { Flex, Image, Link, Text } from '@chakra-ui/react';

import { type ShowWatchProvider } from '~/store/tv/types/transformed';

const PROVIDER_LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w45';

const PROVIDER_SEARCH_URLS: Record<string, (q: string) => string> = {
  'amazon prime video': q => `https://www.primevideo.com/search?phrase=${q}`,
  'amazon video': q => `https://www.primevideo.com/search?phrase=${q}`,
  'apple tv': q => `https://tv.apple.com/search?term=${q}`,
  'apple tv plus': q => `https://tv.apple.com/search?term=${q}`,
  'apple tv+': q => `https://tv.apple.com/search?term=${q}`,
  'apple tv store': q => `https://tv.apple.com/search?term=${q}`,
  'disney plus': q => `https://www.disneyplus.com/search/${q}`,
  'disney+': q => `https://www.disneyplus.com/search/${q}`,
  'fandango at home': q => `https://www.vudu.com/content/movies/search?searchString=${q}`,
  fubotv: q => `https://www.fubo.tv/search?q=${q}`,
  'google play movies': q =>
    `https://play.google.com/store/search?q=${q}&c=movies`,
  'hbo max': q => `https://www.max.com/search?q=${q}`,
  hulu: q => `https://www.hulu.com/search?q=${q}`,
  max: q => `https://www.max.com/search?q=${q}`,
  netflix: q => `https://www.netflix.com/search?q=${q}`,
  peacock: q => `https://www.peacocktv.com/search?q=${q}`,
  'paramount plus': q => `https://www.paramountplus.com/search/?q=${q}`,
  'paramount+': q => `https://www.paramountplus.com/search/?q=${q}`,
  'youtube tv': q => `https://tv.youtube.com/search?q=${q}`,
};

const getProviderLink = (
  providerName: string,
  showName: string,
  fallbackUrl: string
) => {
  const normalized = providerName.trim().toLowerCase();
  const buildUrl = PROVIDER_SEARCH_URLS[normalized];
  if (buildUrl) {
    return buildUrl(encodeURIComponent(showName));
  }
  return fallbackUrl;
};

type Props = {
  providers: ShowWatchProvider[];
  showName: string;
  tmdbWatchUrl: string;
};

export const ProviderChips = ({
  providers,
  showName,
  tmdbWatchUrl,
}: Props) => {
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
          href={getProviderLink(provider.name, showName, tmdbWatchUrl)}
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
