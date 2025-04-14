'use client';

import {
  Toaster as ChakraToaster,
  createToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
} from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: false,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster insetInline={{ mdDown: '4' }} toaster={toaster}>
        {toast => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner color="blue.solid" size="sm" />
            ) : (
              <Toast.Indicator alignSelf="center" />
            )}
            <Stack flex="1" gap="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </Stack>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.meta?.closable && <Toast.CloseTrigger cursor="pointer" />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
};
