import { Box, Flex, Icon, Separator } from '@chakra-ui/react';
import { useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useLocation } from 'wouter';

import {
  CommandPaletteButton,
  useCommandPalette,
} from '~/features/commandPalette';
import { useCollapsibleHeader } from '~/hooks/useCollapsableHeader';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';

import { LoginButton } from './LoginButton';
import { Logo } from './Logo';
import { NavigationLinks } from './NavLinksContainer';
import { SignUpButton } from './SignUpButton';

export const HeaderMobile = () => {
  const [location] = useLocation();
  const isShowPage = location.includes('/show/');
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { openPalette } = useCommandPalette();

  const headerWrapperRef = useRef(null);
  const { isHeaderOpen, closeHeader, toggleHeader } =
    useCollapsibleHeader(headerWrapperRef);

  return (
    <>
      <Box position="relative" ref={headerWrapperRef}>
        <Flex align="center" as="nav" px="4" py="2.5" wrap="wrap">
          <Logo onClose={closeHeader} />

          <Flex align="center" gap="0.5">
            <CommandPaletteButton onClick={openPalette} />

            <Box
              as="button"
              aria-label={isHeaderOpen ? 'Close menu' : 'Open menu'}
              cursor="pointer"
              onClick={toggleHeader}
              p="2"
              borderRadius="md"
              color="cyan.400"
              _hover={{ bg: 'whiteAlpha.100' }}
              transition="all 150ms"
            >
              <Icon as={isHeaderOpen ? FiX : FiMenu} boxSize={5} />
            </Box>
          </Flex>
        </Flex>

        {isHeaderOpen && (
          <Box
            position="absolute"
            left="0"
            right="0"
            bg="bg"
            borderWidth="1px"
            borderColor="whiteAlpha.100"
            borderTopWidth="0"
            shadow="xl"
            zIndex="dropdown"
            px="5"
            py="4"
          >
            <Flex direction="column">
              <NavigationLinks onClose={closeHeader} />

              {!isLoggedIn ? (
                <Flex alignItems="center" gap="12px" mt={4} ml="auto">
                  <SignUpButton />
                  <LoginButton />
                </Flex>
              ) : null}
            </Flex>
          </Box>
        )}
      </Box>

      {!isShowPage && <Separator size="md" />}
    </>
  );
};
