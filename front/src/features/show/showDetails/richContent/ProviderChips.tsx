import { Flex, Image, Link, Text } from '@chakra-ui/react';

import { type ShowWatchProvider } from '~/store/tv/types/transformed';
import {
  getProviderLink,
  PROVIDER_LOGO_BASE_URL,
} from '~/store/tv/utils/watchProviderHelpers';

type Props = {
  providers: ShowWatchProvider[];
  showName: string;
  tmdbWatchUrl: string;
};

export const ProviderChips = ({ providers, showName, tmdbWatchUrl }: Props) => {
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
