import { Flex } from '@chakra-ui/react';

import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';

import { LoginButton } from './LoginButton';
import { SignUpButton } from './SignUpButton';
import { UserMenu } from './UserMenu';

export const RightSectionDesktop = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Flex alignItems="center" gap="10px" justify="flex-end" flex="1">
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
