import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { userApi } from '~/store/user/user.api';
import { setIsLoggedOut } from '~/store/user/user.slice';

const LogoutButton = () => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    localStorage.removeItem('jwt');
    dispatch(setIsLoggedOut());
    dispatch(userApi.util.resetApiState());
  };

  return (
    <Button colorPalette="red" onClick={onLogout} size="xs" variant="surface">
      Logout
    </Button>
  );
};

export default LogoutButton;
