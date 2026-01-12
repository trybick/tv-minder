import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Textarea,
} from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiSend } from 'react-icons/fi';

import { showToast } from '~/components/ui/toaster';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import { useSubmitFeedbackMutation } from '~/store/rtk/api/contact.api';
import {
  selectIsFeedbackModalOpen,
  setIsFeedbackModalOpen,
} from '~/store/rtk/slices/modals.slice';
import { selectEmail } from '~/store/rtk/slices/user.slice';
import { emailRegex } from '~/utils/constants';
import { handleRtkQueryError } from '~/utils/handleRtkQueryError';

type FormValues = {
  feedback: string;
  email: string;
};

const FeedbackModal = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const isOpen = useAppSelector(selectIsFeedbackModalOpen);
  const initialRef = useRef<HTMLTextAreaElement>(null);
  const loggedInEmail = useAppSelector(selectEmail);

  const [submitFeedback, { isLoading: isSubmitLoading }] =
    useSubmitFeedbackMutation();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    watch,
    setError: setFormError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { feedback: '', email: '' },
  });

  const { ref: feedbackRef, ...registerFeedback } = register('feedback');

  const validateEmail = (value: string) =>
    !value || emailRegex.test(value) || 'Please enter a valid email address';

  const onSubmit = async (values: FormValues) => {
    const { feedback, email } = values;

    const formattedEmail = loggedInEmail
      ? `Logged in as ${loggedInEmail}. Provided email: ${email}`
      : email;

    try {
      await submitFeedback({
        text: feedback,
        email: formattedEmail,
      }).unwrap();

      showToast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
        type: 'success',
      });

      resetForm();
      dispatch(setIsFeedbackModalOpen(false));
    } catch (error) {
      const { message } = handleRtkQueryError(error);
      setFormError('root', {
        type: 'server',
        message,
      });
      Sentry.captureException(error, {
        extra: {
          feedback,
          email: formattedEmail,
        },
      });
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
      dispatch(setIsFeedbackModalOpen(false));
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
                color="fg.muted"
                onClick={() => {
                  resetForm();
                  dispatch(setIsFeedbackModalOpen(false));
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
                {...registerFeedback}
                ref={e => {
                  feedbackRef(e);
                  initialRef.current = e;
                }}
              />
            </Field.Root>

            <Field.Root mt={4} invalid={!!errors?.email}>
              <Field.Label>Your email (optional)</Field.Label>
              <Input
                {...register('email', {
                  validate: validateEmail,
                })}
              />
              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors?.root} mt={4}>
              <Field.ErrorText ml={2}>{errors?.root?.message}</Field.ErrorText>
            </Field.Root>
          </Dialog.Body>

          <Dialog.Footer>
            <Button
              colorPalette="cyan"
              disabled={!watch('feedback')}
              loading={isSubmitLoading}
              mr={3}
              onClick={handleSubmit(onSubmit)}
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
