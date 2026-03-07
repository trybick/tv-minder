import { Button, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react';
import { type MouseEvent, useState } from 'react';

import { useAppDispatch, useAppSelector } from '~/store';
import { useUntrackShowMutation } from '~/store/rtk/api/track.api';
import {
  selectIsLoggedIn,
  unregisteredUntrackShow,
} from '~/store/rtk/slices/user.slice';

import { useShowCardContext } from './context';

export const UnTrackXButton = () => {
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
        onClick={onRequestUntrack}
        position="absolute"
        right="2"
        size="xs"
        top="2"
        variant="plain"
        color="fg.muted"
        bg="blackAlpha.600"
        _hover={{ color: 'white', bg: 'blackAlpha.800' }}
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
            <Dialog.Content bg="bg.muted">
              <Dialog.Header>
                <Dialog.Title>Confirm Untrack</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton color="fg.muted" />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="fg.muted" fontSize="md">
                  {`Are you sure you want to untrack ${showName}?`}
                </Text>
              </Dialog.Body>
              <Dialog.Footer gap="4">
                <Button
                  variant="ghost"
                  onClick={() => setIsConfirmOpen(false)}
                  color="fg.muted"
                >
                  Back
                </Button>
                <Button
                  colorPalette="red"
                  onClick={onConfirmUntrack}
                  variant="surface"
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
