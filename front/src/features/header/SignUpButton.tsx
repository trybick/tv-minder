import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsSignUpModalOpen } from '~/store/rtk/slices/modals.slice';

export const SignUpButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      colorPalette="cyan"
      onClick={() => dispatch(setIsSignUpModalOpen(true))}
      variant="solid"
    >
      Sign Up
    </Button>
  );
};
