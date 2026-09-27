import { Flex } from '@chakra-ui/react';

import {
  CommandPaletteButton,
  useCommandPalette,
} from '~/features/commandPalette';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';

import { LoginButton } from './LoginButton';
import { SignUpButton } from './SignUpButton';
import { UserMenu } from './UserMenu';

export const RightSectionDesktop = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { openPalette } = useCommandPalette();

  return (
    <Flex alignItems="center" gap="2" justify="flex-end" flex="1">
      <CommandPaletteButton onClick={openPalette} />

      {isLoggedIn ? (
        <UserMenu />
      ) : (
        <Flex alignItems="center" gap="1.5" ml="1">
          <LoginButton />
          <SignUpButton />
        </Flex>
      )}
    </Flex>
  );
};
