import { Box, Flex, Separator } from '@chakra-ui/react';
import { useRef } from 'react';
import { useLocation } from 'wouter';

import {
  CommandPaletteButton,
  useCommandPalette,
} from '~/features/commandPalette';
import { useCollapsibleHeader } from '~/hooks/useCollapsableHeader';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';

import { HelpPopover } from './HelpPopover';
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
        <Flex align="center" as="nav" p="15px 24px" wrap="wrap">
          <Logo onClose={closeHeader} />

          <Flex align="center" gap="4px">
            <HelpPopover />
            <CommandPaletteButton onClick={openPalette} />

            <Box cursor="pointer" onClick={toggleHeader} p="8px">
              <svg
                fill="teal"
                viewBox="0 0 20 20"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
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
            borderColor="bg"
            borderTopWidth="0"
            shadow="lg"
            zIndex="dropdown"
            p="18px 24px"
          >
            <Flex direction="column" gap="2px">
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
