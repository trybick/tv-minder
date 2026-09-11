import { Button, type ButtonProps } from '@chakra-ui/react';

export const AuthTextButton = (props: ButtonProps) => {
  return (
    <Button
      variant="plain"
      color="fg.muted"
      fontSize="sm"
      fontWeight="medium"
      height="auto"
      minWidth="0"
      px="0"
      _hover={{ color: 'fg' }}
      {...props}
    />
  );
};
