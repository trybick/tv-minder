import { Flex } from '@chakra-ui/react';

import {
  CommandPaletteButton,
  useCommandPalette,
} from '~/features/commandPalette';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';

import { HelpPopover } from './HelpPopover';
import { LoginButton } from './LoginButton';
import { SignUpButton } from './SignUpButton';
import { UserMenu } from './UserMenu';

export const RightSectionDesktop = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { openPalette } = useCommandPalette();

  return (
    <Flex alignItems="center" gap="10px" justify="flex-end" flex="1">
      <HelpPopover />
      <CommandPaletteButton onClick={openPalette} />

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
