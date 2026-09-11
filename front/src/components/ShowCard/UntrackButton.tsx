import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { type MouseEvent, useState } from 'react';

import { useShowCardContext } from '~/components/ShowCard/context';
import { useAppDispatch, useAppSelector } from '~/store';
import { useUntrackShowMutation } from '~/store/rtk/api/track.api';
import {
  selectIsLoggedIn,
  unregisteredUntrackShow,
} from '~/store/rtk/slices/user.slice';

export const UntrackButton = () => {
  const { show } = useShowCardContext();
  const { id: showId, name: showName } = show;
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [untrackShow] = useUntrackShowMutation();

  const onRequestUntrack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const onConfirmUntrack = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoggedIn) {
      await untrackShow(showId);
    } else {
      dispatch(unregisteredUntrackShow(showId));
    }
    setIsConfirmOpen(false);
  };

  return (
    <>
      <CloseButton
        aria-label={`Untrack ${showName}`}
        onClick={onRequestUntrack}
        position="absolute"
        right="2"
        size="xs"
        top="2"
        variant="plain"
        rounded="full"
        color="whiteAlpha.800"
        bg="blackAlpha.600"
        backdropFilter="blur(8px)"
        transition="background 150ms, color 150ms"
        _hover={{ color: 'white', bg: 'red.600' }}
        zIndex="1"
      />
      <Portal>
        <Dialog.Root
          open={isConfirmOpen}
          onOpenChange={e => setIsConfirmOpen(e.open)}
          size="sm"
          lazyMount
          unmountOnExit
        >
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header
                display="flex"
                flexDirection="column"
                gap="1"
                pt="7"
                pb="2"
              >
                <Dialog.Title fontSize="xl" fontWeight="semibold">
                  Untrack {showName}?
                </Dialog.Title>
                <Dialog.Description color="fg.muted" fontSize="sm">
                  Its episodes will no longer appear on your calendar.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.CloseTrigger asChild top="4" right="4">
                <CloseButton color="fg.muted" size="sm" rounded="full" />
              </Dialog.CloseTrigger>
              <Dialog.Footer gap="2" pb="6">
                <Button
                  variant="ghost"
                  rounded="lg"
                  onClick={() => setIsConfirmOpen(false)}
                  color="fg.muted"
                  _hover={{ bg: 'whiteAlpha.100', color: 'fg' }}
                >
                  Cancel
                </Button>
                <Button
                  colorPalette="red"
                  rounded="lg"
                  fontWeight="semibold"
                  onClick={onConfirmUntrack}
                  variant="solid"
                >
                  Untrack
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Portal>
    </>
  );
};
