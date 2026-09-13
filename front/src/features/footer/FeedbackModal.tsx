import {
  Alert,
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  type InputProps,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

import { showToast } from '~/components/ui/toaster';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch, useAppSelector } from '~/store';
import { useSubmitFeedbackMutation } from '~/store/rtk/api/contact.api';
import {
  selectIsFeedbackModalOpen,
  setIsFeedbackModalOpen,
} from '~/store/rtk/slices/modals.slice';
import { selectEmail } from '~/store/rtk/slices/user.slice';
import { emailRegex } from '~/utils/constants';
import { handleRtkQueryError } from '~/utils/handleRtkQueryError';
import { passwordManagerIgnoreProps } from '~/utils/passwordManagerIgnore';

type FormValues = {
  feedback: string;
  email: string;
};

const feedbackInputStyles = {
  size: 'lg',
  rounded: 'lg',
  bg: 'bg',
  borderColor: 'whiteAlpha.300',
  _hover: { borderColor: 'whiteAlpha.400' },
  _placeholder: { color: 'fg.subtle' },
} satisfies InputProps;

export const FeedbackModal = () => {
  const dispatch = useAppDispatch();
  const { isMobile } = useResponsiveLayout();
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
      <Dialog.Backdrop pointerEvents={isOpen ? 'auto' : 'none'} />
      <Dialog.Positioner>
        <Dialog.Content maxW="md">
          <Dialog.Header
            display="flex"
            flexDirection="column"
            gap="1"
            pt="8"
            pb="3"
          >
            <Dialog.Title
              fontSize="2xl"
              fontWeight="semibold"
              lineHeight="shorter"
            >
              Share feedback
            </Dialog.Title>
            <Dialog.Description color="fg.muted" fontSize="sm">
              Found a bug or have an idea? We read every message.
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.CloseTrigger asChild top="4" right="4">
            <CloseButton
              color="fg.muted"
              size="sm"
              rounded="full"
              onClick={() => {
                resetForm();
                dispatch(setIsFeedbackModalOpen(false));
              }}
            />
          </Dialog.CloseTrigger>

          <Dialog.Body pt="4" pb="6">
            <Stack gap="4">
              <Field.Root>
                <Field.Label>{"What's on your mind?"}</Field.Label>
                <Textarea
                  {...feedbackInputStyles}
                  {...passwordManagerIgnoreProps}
                  h="150px"
                  resize="none"
                  placeholder="Tell us what you think..."
                  {...registerFeedback}
                  ref={e => {
                    feedbackRef(e);
                    initialRef.current = e;
                  }}
                />
              </Field.Root>

              <Field.Root invalid={!!errors?.email}>
                <Field.Label>Your email (optional)</Field.Label>
                <Input
                  {...feedbackInputStyles}
                  {...passwordManagerIgnoreProps}
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    validate: validateEmail,
                  })}
                />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>
            </Stack>

            {errors?.root?.message && (
              <Alert.Root
                status="error"
                variant="subtle"
                size="sm"
                rounded="lg"
                mt="4"
              >
                <Alert.Indicator />
                <Alert.Title fontWeight="medium">
                  {errors.root.message}
                </Alert.Title>
              </Alert.Root>
            )}

            <Button
              colorPalette="cyan"
              size="lg"
              width="full"
              rounded="lg"
              mt="6"
              fontWeight="semibold"
              disabled={!watch('feedback')}
              loading={isSubmitLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Send
            </Button>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
