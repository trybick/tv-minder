import { ChangeEvent, useRef, useState } from 'react';
import { Button, CloseButton, Dialog, Text, Textarea } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { FiSend } from 'react-icons/fi';
import ENDPOINTS from 'constants/endpoints';
import handleErrors from 'utils/handleErrors';
import { DisclosureProps } from 'types/common';
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
      await axios.post(`${ENDPOINTS.TV_MINDER_SERVER}/contact`, { text: feedback });
      toaster.create({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
        type: 'success',
        duration: 5000,
        meta: {
          meta: { closable: true },
        },
      });

      onClose();
    } catch (error) {
      setError(error.message);
      handleErrors(error as AxiosError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root
      initialFocusEl={() => initialRef.current}
      onOpenChange={onClose}
      open={isOpen}
      lazyMount
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{"What's on your mind?"}</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <Textarea h="150px" mb={2} onChange={handleChange} ref={initialRef} value={feedback} />
            {error && (
              <Text color="#ff3e3e" fontSize="sm">
                {error}
              </Text>
            )}
          </Dialog.Body>

          <Dialog.Footer>
            <Button
              bg="primary"
              color="white"
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
