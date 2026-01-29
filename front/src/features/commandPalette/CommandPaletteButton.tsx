import { Box, Flex, Kbd } from '@chakra-ui/react';
import { MdSearch } from 'react-icons/md';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { getIsMac } from '~/utils/getIsMac';

type Props = {
  onClick: () => void;
};

export const CommandPaletteButton = ({ onClick }: Props) => {
  const { isMobile, isCompactDesktop } = useResponsiveLayout();

  const modifierKey = getIsMac() ? '⌘' : 'Ctrl';

  // Mobile: just an icon button
  if (isMobile) {
    return (
      <Box
        as="button"
        onClick={onClick}
        p="8px"
        borderRadius="md"
        _hover={{ bg: 'whiteAlpha.100' }}
        aria-label="Search"
      >
        <MdSearch size={22} />
      </Box>
    );
  }

  // Compact desktop: smaller button with just kbd hint
  if (isCompactDesktop) {
    return (
      <Flex
        as="button"
        onClick={onClick}
        alignItems="center"
        gap="6px"
        px="10px"
        py="6px"
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="md"
        color="fg.muted"
        fontSize="sm"
        cursor="pointer"
        transition="all 150ms"
        _hover={{
          bg: 'whiteAlpha.100',
          borderColor: 'whiteAlpha.300',
        }}
      >
        <MdSearch size={16} />
        <Flex gap="2px">
          <Kbd size="sm">{modifierKey}</Kbd>
          <Kbd size="sm">K</Kbd>
        </Flex>
      </Flex>
    );
  }

  // Full desktop: full search bar
  return (
    <Flex
      as="button"
      onClick={onClick}
      alignItems="center"
      gap="12px"
      px="12px"
      py="6px"
      bg="whiteAlpha.50"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="md"
      color="fg.muted"
      fontSize="sm"
      cursor="pointer"
      transition="all 150ms"
      _hover={{
        bg: 'whiteAlpha.100',
        borderColor: 'whiteAlpha.300',
      }}
      minW="200px"
    >
      <MdSearch size={16} />
      <Box flex="1" textAlign="left">
        Search...
      </Box>
      <Flex gap="4px">
        <Kbd size="sm">{modifierKey}</Kbd>
        <Kbd size="sm">K</Kbd>
      </Flex>
    </Flex>
  );
};
