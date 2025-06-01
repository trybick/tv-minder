import { Box, Flex, Separator } from '@chakra-ui/react';
import { useRef } from 'react';
import { useLocation } from 'wouter';

import { ColorModeButton } from '~/components/ui/color-mode';
import { useColorMode } from '~/components/ui/color-mode';
import { useCollapsibleHeader } from '~/hooks/useCollapsableHeader';
import { useAppSelector } from '~/store';
import { selectIsGoogleUser, selectIsLoggedIn } from '~/store/user/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import LoginButton from './LoginButton';
import Logo from './Logo';
import LogoutButton from './LogoutButton';
import NavigationLinks from './NavigationLinks';
import SignUpButton from './SignUpButton';

const HeaderMobile = () => {
  const { toggleColorMode } = useColorMode();
  const [location] = useLocation();
  const isShowPage = location.includes('/show/');

  const containerRef = useRef(null);
  const { isOpen, closeHeader, toggleIsOpen } =
    useCollapsibleHeader(containerRef);

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);

  return (
    <>
      <Flex
        align="center"
        as="nav"
        p="15px 24px"
        wrap="wrap"
        ref={containerRef}
      >
        <Logo onClose={closeHeader} />

        <Box cursor="pointer" onClick={toggleIsOpen}>
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

        <Box
          display={isOpen ? 'block' : 'none'}
          gap="10px"
          pt="6px"
          w="full"
          alignItems="flex-end"
          flexDir="column"
          ml="auto"
          mr="unset"
        >
          <NavigationLinks onClose={closeHeader} />
          {isLoggedIn && !isGoogleUser && (
            <Box>
              <NavigationLinks onClose={closeHeader} />
            </Box>
          )}
        </Box>

        <Box
          display={isOpen ? 'block' : 'none'}
          justifyContent="flex-start"
          mt={4}
          textAlign={isLoggedIn ? 'right' : 'left'}
        >
          {isLoggedIn ? (
            <Box>
              <ColorModeButton
                mr="12px"
                onClick={() => {
                  closeHeader();
                  applyViewTransition(toggleColorMode);
                }}
              />
              <LogoutButton closeHeader={closeHeader} />
            </Box>
          ) : (
            <Flex alignItems="center" gap="10px" justify="flex-end">
              <ColorModeButton
                onClick={() => {
                  closeHeader();
                  applyViewTransition(toggleColorMode);
                }}
              />
              <SignUpButton />
              <LoginButton />
            </Flex>
          )}
        </Box>
      </Flex>

      {!isShowPage && <Separator size="md" />}
    </>
  );
};

export default HeaderMobile;
