import { Flex } from '@chakra-ui/react';

import { ColorModeButton } from '~/components/ui/color-mode';
import { useColorMode } from '~/components/ui/color-mode';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/user/selectors';
import { applyViewTransition } from '~/utils/applyViewTransition';

import LoginButton from './LoginButton';
import SignUpButton from './SignUpButton';
import UserMenu from './UserMenu';

const RightSectionDesktop = () => {
  const { toggleColorMode } = useColorMode();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const handleColorModeClick = () => {
    applyViewTransition(toggleColorMode);
  };

  return (
    <Flex alignItems="center" gap="10px" justify="flex-end" flex="1">
      <ColorModeButton onClick={handleColorModeClick} />

      {isLoggedIn ? (
        <UserMenu />
      ) : (
        <>
          <SignUpButton />
          <LoginButton />
        </>
      )}
    </Flex>
  );
};

export default RightSectionDesktop;
