import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsSignUpModalOpen } from '~/store/rtk/slices/modals.slice';
import { trackEvent } from '~/utils/analytics';

export const SignUpButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      colorPalette="cyan"
      rounded="lg"
      fontWeight="semibold"
      shadow="sm"
      onClick={() => {
        trackEvent({
          category: 'Auth',
          action: 'Sign Up Header Button Pressed',
        });
        dispatch(setIsSignUpModalOpen(true));
      }}
      variant="solid"
      transitionProperty="background, box-shadow, transform"
      transitionDuration="fast"
      _hover={{ shadow: 'md' }}
      _active={{ transform: 'translateY(1px)', shadow: 'xs' }}
    >
      Sign Up
    </Button>
  );
};
