import { Alert } from '@chakra-ui/react';

type Props = {
  message?: string;
};

export const AuthFormError = ({ message }: Props) => {
  if (!message) {
    return null;
  }

  return (
    <Alert.Root status="error" variant="subtle" size="sm" rounded="lg" mt="4">
      <Alert.Indicator />
      <Alert.Title fontWeight="medium">{message}</Alert.Title>
    </Alert.Root>
  );
};
