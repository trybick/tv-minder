import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsLoggedOut } from '~/store/rtk/slices/user.slice';

const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(setIsLoggedOut());
  };

  return (
    <Button colorPalette="red" onClick={onLogout} size="xs" variant="surface">
      Logout
    </Button>
  );
};

export default LogoutButton;
