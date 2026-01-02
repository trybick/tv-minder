import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsLoginModalOpen } from '~/store/rtk/slices/modals.slice';

const LoginButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      colorPalette="cyan"
      ml="3px"
      onClick={() => dispatch(setIsLoginModalOpen(true))}
      variant="surface"
    >
      Login
    </Button>
  );
};

export default LoginButton;
