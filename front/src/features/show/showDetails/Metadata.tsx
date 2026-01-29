import { Flex, Icon, Text } from '@chakra-ui/react';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { TbLanguage } from 'react-icons/tb';

import { DelayedSkeleton } from '~/components/DelayedSkeleton';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';
import type { ShowForDisplay } from '~/store/tv/types/transformed';

type Props = {
  show?: ShowForDisplay | null;
};

/**
 * Network/runtime/language row for the show.
 */
export const Metadata = ({ show }: Props) => {
  const { isMobile } = useResponsiveLayout();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);
  const { network, episodeRunTime, language } = show || {};
  const hasMetadata = network || episodeRunTime || language;

  if (isLoading) {
    return <DelayedSkeleton isLoading={isLoading} w="180px" h="24px" />;
  }

  if (!hasMetadata) {
    return null;
  }

  return (
    <Flex
      gap={6}
      flexWrap="wrap"
      color="fg.muted"
      pt={isMobile ? 0 : 4}
      borderTop={isMobile ? 'none' : '1px solid'}
      borderColor="whiteAlpha.100"
      ml={isMobile ? 2 : 0}
    >
      {network && (
        <Flex align="center" gap={2}>
          <Icon as={HiOutlineVideoCamera} boxSize="18px" opacity={0.7} />
          <Text fontSize="sm" fontWeight="500">
            {network}
          </Text>
        </Flex>
      )}
      {episodeRunTime && (
        <Flex align="center" gap={2}>
          <Icon as={IoIosTimer} boxSize="18px" opacity={0.7} />
          <Text fontSize="sm" fontWeight="500">
            {episodeRunTime} min
          </Text>
        </Flex>
      )}
      {language && (
        <Flex align="center" gap={2}>
          <Icon as={TbLanguage} boxSize="18px" opacity={0.7} />
          <Text fontSize="sm" fontWeight="500">
            {language}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
