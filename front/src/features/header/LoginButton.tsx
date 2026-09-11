import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsLoginModalOpen } from '~/store/rtk/slices/modals.slice';
import { trackEvent } from '~/utils/analytics';

export const LoginButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      colorPalette="gray"
      color="fg.muted"
      rounded="lg"
      fontWeight="semibold"
      onClick={() => {
        trackEvent({ category: 'Auth', action: 'Login Header Button Pressed' });
        dispatch(setIsLoginModalOpen(true));
      }}
      variant="ghost"
      _hover={{ bg: 'whiteAlpha.100', color: 'fg' }}
    >
      Login
    </Button>
  );
};
