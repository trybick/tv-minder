import { Box, Input, type InputProps } from '@chakra-ui/react';

import {
  PasswordInput,
  type PasswordInputProps,
} from '~/components/ui/password-input';

import { useIsAuthDialogClosing } from './authDialogClosingContext';

const authInputStyles = {
  size: 'lg',
  rounded: 'lg',
  bg: 'bg',
  borderColor: 'whiteAlpha.300',
  _hover: { borderColor: 'whiteAlpha.400' },
  _invalid: {
    borderColor: 'var(--error-color)',
    _hover: { borderColor: 'var(--error-color)' },
  },
  _placeholder: { color: 'fg.subtle' },
} satisfies InputProps;

const DetachedInputPlaceholder = () => {
  return (
    <Box
      w="full"
      h="11"
      rounded="lg"
      bg="bg"
      borderWidth="1px"
      borderColor="whiteAlpha.300"
    />
  );
};

export const AuthInput = (props: InputProps) => {
  const isDialogClosing = useIsAuthDialogClosing();

  if (isDialogClosing) {
    return <DetachedInputPlaceholder />;
  }

  return <Input {...authInputStyles} {...props} />;
};

export const AuthPasswordInput = (props: PasswordInputProps) => {
  const isDialogClosing = useIsAuthDialogClosing();

  if (isDialogClosing) {
    return <DetachedInputPlaceholder />;
  }

  return <PasswordInput {...authInputStyles} {...props} />;
};
