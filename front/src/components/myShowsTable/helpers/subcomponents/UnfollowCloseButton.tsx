import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { removeFromFollowedShowsAction } from 'store/user/actions';

interface Props {
  showId: number;
  showName: string;
}

const UnfollowCloseButton = ({ showId, showName }: Props) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  const onUnfollowShow = () => {
    dispatch(removeFromFollowedShowsAction(showId));
  };

  return (
    <Flex align="center" h="100%">
      <CloseButton onClick={() => setIsOpen(true)} size="sm" />

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent mx="20px">
            <AlertDialogHeader>Unfollow {showName}</AlertDialogHeader>
            <AlertDialogBody>Are you sure?</AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose} ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={onUnfollowShow}>
                Unfollow
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default UnfollowCloseButton;
