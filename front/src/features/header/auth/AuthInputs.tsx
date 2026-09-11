import { Input, type InputProps } from '@chakra-ui/react';

import {
  PasswordInput,
  type PasswordInputProps,
} from '~/components/ui/password-input';

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

export const AuthInput = (props: InputProps) => {
  return <Input {...authInputStyles} {...props} />;
};

export const AuthPasswordInput = (props: PasswordInputProps) => {
  return <PasswordInput {...authInputStyles} {...props} />;
};
