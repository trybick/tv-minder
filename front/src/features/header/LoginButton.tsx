import { Button } from '@chakra-ui/react';

import { useAppDispatch } from '~/store';
import { setIsLoginModalOpen } from '~/store/rtk/slices/modals.slice';
import { trackEvent } from '~/utils/analytics';

export const LoginButton = () => {
  const dispatch = useAppDispatch();

  return (
    <Button
      colorPalette="cyan"
      ml="3px"
      onClick={() => {
        trackEvent({ category: 'Auth', action: 'Login Header Button Pressed' });
        dispatch(setIsLoginModalOpen(true));
      }}
      variant="surface"
    >
      Login
    </Button>
  );
};
