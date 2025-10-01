import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsLoginModalOpen } from '~/store/modals/modals.slice';

import LoginModal from './LoginModal';

const LoginButton = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        colorPalette="cyan"
        ml="3px"
        onClick={() => dispatch(setIsLoginModalOpen(true))}
        variant="surface"
      >
        Login
      </Button>

      <LoginModal />
    </>
  );
};

export default LoginButton;
