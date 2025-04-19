import { Button, CloseButton, Dialog, Text, Textarea } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { ChangeEvent, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import ENDPOINTS from '~/constants/endpoints';
import { DisclosureProps } from '~/types/common';
import handleErrors from '~/utils/handleErrors';
import { toaster } from '../ui/toaster';

type Props = {
  disclosureProps: DisclosureProps;
};

const FeedbackModal = ({ disclosureProps }: Props) => {
  const { isOpen, onClose } = disclosureProps;
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`${ENDPOINTS.TV_MINDER_SERVER}/contact`, {
        text: feedback,
      });
      toaster.create({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
        type: 'success',
        duration: 5000,
        meta: { closable: true },
      });

      onClose();
    } catch (error) {
      setError(
        error instanceof AxiosError
          ? error.message
          : 'An unknown error occurred'
      );
      handleErrors(error as AxiosError);
    } finally {
      setFeedback('');
      setIsSubmitting(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setFeedback('');
      onClose();
    }
  };

  return (
    <Dialog.Root
      initialFocusEl={() => initialRef.current}
      onOpenChange={e => handleClose(e.open)}
      open={isOpen}
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{"What's on your mind?"}</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                onClick={() => {
                  setFeedback('');
                  onClose();
                }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <Textarea
              h="150px"
              mb={2}
              onChange={handleChange}
              ref={initialRef}
              value={feedback}
            />
            {error && (
              <Text color="#ff3e3e" fontSize="sm">
                {error}
              </Text>
            )}
          </Dialog.Body>

          <Dialog.Footer>
            <Button
              colorPalette="cyan"
              disabled={!feedback}
              loading={isSubmitting}
              mr={3}
              onClick={handleSubmit}
            >
              Send
              <FiSend />
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default FeedbackModal;
