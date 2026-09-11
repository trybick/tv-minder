import { Button, Text } from '@chakra-ui/react';

type Props = {
  prompt: string;
  actionLabel: string;
  onClick: () => void;
};

export const AuthSwitchPrompt = ({ prompt, actionLabel, onClick }: Props) => {
  return (
    <Text color="fg.muted" fontSize="sm" textAlign="center" width="full">
      {prompt}{' '}
      <Button
        variant="plain"
        color="cyan.fg"
        fontSize="sm"
        fontWeight="medium"
        height="auto"
        minWidth="0"
        px="0"
        verticalAlign="baseline"
        onClick={onClick}
        _hover={{ textDecoration: 'underline' }}
      >
        {actionLabel}
      </Button>
    </Text>
  );
};
