import { Flex, Separator } from '@chakra-ui/react';
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
      <Flex as="nav" p="17px 1.6rem 15px">
        <Logo />
        <NavigationLinks />

        <Flex alignItems="center" gap="10px" justify="flex-end" flex="1">
          <ColorModeButton
            onClick={() => applyViewTransition(toggleColorMode)}
          />
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <>
              <SignUpButton />
              <LoginButton />
            </>
          )}
        </Flex>
      </Flex>

      {!isShowPage && <Separator size="md" />}
    </>
  );
};

export default DesktopHeader;
