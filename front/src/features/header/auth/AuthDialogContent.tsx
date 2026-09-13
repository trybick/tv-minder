import { CloseButton, Dialog, useDialogContext } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { AuthDialogClosingContext } from './authDialogClosingContext';

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export const AuthDialogContent = ({ title, description, children }: Props) => {
  const dialog = useDialogContext();

  return (
    <AuthDialogClosingContext.Provider value={!dialog.open}>
      <Dialog.Content
        bg="bg.muted"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        rounded="2xl"
        shadow="2xl"
        maxW="md"
      >
        <Dialog.Header
          display="flex"
          flexDirection="column"
          gap="1"
          pt="8"
          pb="3"
        >
          <Dialog.Title
            color="fg"
            fontSize="2xl"
            fontWeight="semibold"
            letterSpacing="tight"
            lineHeight="shorter"
          >
            {title}
          </Dialog.Title>
          <Dialog.Description color="fg.muted" fontSize="sm">
            {description}
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.CloseTrigger asChild top="4" right="4">
          <CloseButton color="fg.muted" size="sm" rounded="full" />
        </Dialog.CloseTrigger>

        {children}
      </Dialog.Content>
    </AuthDialogClosingContext.Provider>
  );
};
