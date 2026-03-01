import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsSignUpModalOpen } from '~/store/rtk/slices/modals.slice';
import { trackEvent } from '~/utils/analytics';

export const SignUpButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      colorPalette="cyan"
      onClick={() => {
        trackEvent({
          category: 'Auth',
          action: 'Sign Up Header Button Pressed',
        });
        dispatch(setIsSignUpModalOpen(true));
      }}
      variant="solid"
    >
      Sign Up
    </Button>
  );
};
