import { Box, Flex, Separator } from '@chakra-ui/react';
import { useRef } from 'react';
import { useLocation } from 'wouter';

import { ColorModeButton } from '~/components/ui/color-mode';
import { useColorMode } from '~/components/ui/color-mode';
import { useCollapsibleHeader } from '~/hooks/useCollapsableHeader';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/user/selectors';
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
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const headerWrapperRef = useRef(null);
  const { isOpen, closeHeader, toggleIsOpen } =
    useCollapsibleHeader(headerWrapperRef);

  return (
    <>
      <Flex
        align="center"
        as="nav"
        p="15px 24px"
        wrap="wrap"
        ref={headerWrapperRef}
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

        {isOpen && (
          <Flex pt="6px" w="full">
            <NavigationLinks onClose={closeHeader} />
          </Flex>
        )}

        <Box
          // Need to use this syntax instead of conditional rendering to avoid
          // collapsible header closing when clicking
          display={isOpen ? 'block' : 'none'}
          mt={4}
          ml="auto"
        >
          <Flex alignItems="center" gap="12px">
            <ColorModeButton
              onClick={() => applyViewTransition(toggleColorMode)}
            />

            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <>
                <SignUpButton />
                <LoginButton />
              </>
            )}
          </Flex>
        </Box>
      </Flex>

      {!isShowPage && <Separator size="md" />}
    </>
  );
};

export default HeaderMobile;
