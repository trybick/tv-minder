import { Button, type ButtonProps } from '@chakra-ui/react';

export const AuthSubmitButton = (props: ButtonProps) => {
  return (
    <Button
      colorPalette="cyan"
      variant="solid"
      type="submit"
      size="lg"
      width="full"
      rounded="lg"
      mt="6"
      fontWeight="semibold"
      {...props}
    />
  );
};
