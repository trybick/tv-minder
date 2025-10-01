import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsSignUpModalOpen } from '~/store/modals/modals.slice';

import SignUpModal from './SignUpModal';

const SignUpButton = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        colorPalette="cyan"
        onClick={() => dispatch(setIsSignUpModalOpen(true))}
        variant="solid"
      >
        Sign Up
      </Button>
      <SignUpModal />
    </>
  );
};

export default SignUpButton;
