import { IToast } from '@chakra-ui/core';

export const localWarningToastMessage: IToast = {
  title: 'Temporarily saving',
  description: 'Be sure to sign up to save permanently',
  status: 'warning',
  duration: 7000,
  isClosable: true,
  position: window.innerWidth > 767 ? 'bottom-right' : 'bottom',
};
