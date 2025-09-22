import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { ChangeEvent, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';

import { toaster } from '~/components/ui/toaster';
import ENDPOINTS from '~/gateway/endpoints';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { selectEmail } from '~/store/user/user.slice';
import { DisclosureProps } from '~/types/common';
import { emailRegex } from '~/utils/constants';
import handleErrors from '~/utils/handleErrors';

type Props = {
  disclosureProps: DisclosureProps;
};

const FeedbackModal = ({ disclosureProps }: Props) => {
  const isMobile = useIsMobile();
  const { isOpen, onClose } = disclosureProps;
  const initialRef = useRef<HTMLTextAreaElement>(null);
  const loggedInEmail = useAppSelector(selectEmail);

  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const resetForm = () => {
    setFeedback('');
    setEmail('');
    setError('');
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (email && !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const formattedEmail = loggedInEmail
      ? `Logged in as ${loggedInEmail}. Provided email: ${email}`
      : email;

    setIsSubmitting(true);
    try {
      await axios.post(`${ENDPOINTS.TV_MINDER_SERVER}/contact`, {
        text: feedback,
        email: formattedEmail,
      });
      toaster.create({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
        type: 'success',
        duration: 5000,
        meta: { closable: true },
      });

      resetForm();
      onClose();
    } catch (error) {
      setError(
        error instanceof AxiosError
          ? error.message
          : 'An unknown error occurred'
      );
      setIsSubmitting(false);
      handleErrors(error as AxiosError);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog.Root
      initialFocusEl={() => (isMobile ? null : initialRef.current)}
      onOpenChange={e => handleClose(e.open)}
      open={isOpen}
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="bg.muted">
          <Dialog.Header>
            <Dialog.Title>Send Feedback</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                onClick={() => {
                  resetForm();
                  onClose();
                }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <Field.Root>
              <Field.Label>{"What's on your mind?"}</Field.Label>
              <Textarea
                h="150px"
                mb={2}
                onChange={handleFeedbackChange}
                ref={initialRef}
                value={feedback}
              />
            </Field.Root>

            <Field.Root mt={4}>
              <Field.Label>Your email (optional)</Field.Label>
              <Input onChange={handleEmailChange} value={email} />
            </Field.Root>

            {error && (
              <Text color="#ff3e3e" fontSize="sm" mt={2}>
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
