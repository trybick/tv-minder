import { Box, Flex, Separator } from '@chakra-ui/react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

import { ColorModeButton } from '~/components/ui/color-mode';
import { useColorMode } from '~/components/ui/color-mode';
import { useAppSelector } from '~/store';
import { selectIsGoogleUser, selectIsLoggedIn } from '~/store/user/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import LoginButton from './LoginButton';
import Logo from './Logo';
import LogoutButton from './LogoutButton';
import NavigationLinks from './NavigationLinks';
import SignUpButton from './SignUpButton';

function useHeaderManager(ref: RefObject<HTMLDivElement | null>) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const closeHeader = () => setIsOpen(false);

  useEffect(() => {
    function closeHeaderOnOutsideClick(event: Event) {
      const isClickOutside =
        ref.current && !ref.current.contains(event.target as Node);
      if (isClickOutside && isOpen) {
        closeHeader();
      }
    }
    document.addEventListener('mousedown', closeHeaderOnOutsideClick);
    return () => {
      document.removeEventListener('mousedown', closeHeaderOnOutsideClick);
    };
  }, [isOpen, ref]);

  return { isOpen, closeHeader, toggleIsOpen };
}

const MobileHeader = () => {
  const { toggleColorMode } = useColorMode();
  const [location] = useLocation();
  const isShowPage = location.includes('/show/');
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isGoogleUser = useAppSelector(selectIsGoogleUser);
  const containerRef = useRef(null);
  const { isOpen, closeHeader, toggleIsOpen } = useHeaderManager(containerRef);

  return (
    <>
      <Flex
        align="center"
        as="nav"
        justify="space-between"
        p="21px 1.6rem 9px"
        wrap="wrap"
        ref={containerRef}
      >
        <Logo onClose={closeHeader} />

        <Box cursor="pointer" onClick={toggleIsOpen}>
          <svg
            fill="teal"
            viewBox="0 0 20 20"
            width="17px"
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

      {!isShowPage && <Separator mt="6px" size="md" />}
    </>
  );
};

export default MobileHeader;
