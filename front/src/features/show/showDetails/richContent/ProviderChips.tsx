import { Flex, Image, Link, Text } from '@chakra-ui/react';

import { type ShowWatchProvider } from '~/store/tv/types/transformed';

const PROVIDER_LOGO_BASE_URL = 'https://image.tmdb.org/t/p/w45';

type Props = {
  providers: ShowWatchProvider[];
  tmdbWatchUrl: string;
};

export const ProviderChips = ({ providers, tmdbWatchUrl }: Props) => {
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
          href={tmdbWatchUrl}
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
