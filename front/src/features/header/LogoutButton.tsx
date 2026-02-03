import { Button, HStack, Icon } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';

import { useAppDispatch } from '~/store';
import { setIsLoggedOut } from '~/store/rtk/slices/user.slice';

export const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(setIsLoggedOut());
  };

  return (
    <Button colorPalette="red" onClick={onLogout} size="xs" variant="surface">
      <HStack as="span" gap="1">
        <Icon as={FiLogOut} size="sm" />
        <span>Logout</span>
      </HStack>
    </Button>
  );
};
