import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsLoggedOutAction } from '~/store/user/actions';

type Props = {
  closeHeader: () => void;
};

const LogoutButton = ({ closeHeader }: Props) => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    localStorage.removeItem('jwt');
    closeHeader();
    dispatch(setIsLoggedOutAction());
  };

  return (
    <Button colorPalette="red" onClick={onLogout} size="xs" variant="surface">
      Logout
    </Button>
  );
};

export default LogoutButton;
