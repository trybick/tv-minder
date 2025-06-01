import { Box, Flex, Separator } from '@chakra-ui/react';
import { useLocation } from 'wouter';

import { ColorModeButton } from '~/components/ui/color-mode';
import { useColorMode } from '~/components/ui/color-mode';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/user/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import LoginButton from './LoginButton';
import Logo from './Logo';
import NavigationLinks from './NavigationLinks';
import SignUpButton from './SignUpButton';
import UserMenu from './UserMenu';

const DesktopHeader = () => {
  const { toggleColorMode } = useColorMode();
  const [location] = useLocation();
  const isShowPage = location.includes('/show/');
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <>
      <Flex
        align="center"
        as="nav"
        justify="space-between"
        p="15px 1.6rem 9px"
        wrap="wrap"
      >
        <Logo />

        <Box display="flex" gap="10px" pt="6px">
          <NavigationLinks />
        </Box>

        <Box display="flex" justifyContent="flex-end">
          {isLoggedIn ? (
            <Box display="flex">
              <ColorModeButton
                mr="8px"
                onClick={() => applyViewTransition(toggleColorMode)}
              />
              <UserMenu />
            </Box>
          ) : (
            <Flex alignItems="center" gap="10px" justify="flex-end">
              <ColorModeButton
                onClick={() => applyViewTransition(toggleColorMode)}
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

export default DesktopHeader;
