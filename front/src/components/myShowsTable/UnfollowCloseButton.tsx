import { useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  CloseButton,
  Flex,
} from '@chakra-ui/react';
import { useAppDispatch } from 'store';
import { removeFromFollowedShowsAction } from 'store/user/actions';
import { ID } from 'types/common';

type Props = {
  showId: ID;
  showName: string;
};

const UnfollowCloseButton = ({ showId, showName }: Props) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = useRef(null);

  const onUnfollowShow = () => {
    setIsOpen(false);
    dispatch(removeFromFollowedShowsAction(showId));
  };

  return (
    <Flex align="center" h="100%">
      <CloseButton onClick={() => setIsOpen(true)} size="md" />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx="20px">
            <AlertDialogHeader>{showName}</AlertDialogHeader>
            <AlertDialogBody>Do you want to unfollow this show?</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsOpen(false)} ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={onUnfollowShow}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default UnfollowCloseButton;
