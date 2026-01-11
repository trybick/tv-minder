import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import InlineTextSeparator from '~/components/InlineTextSeparator';
import { PasswordInput } from '~/components/ui/password-input';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  useLoginMutation,
  useRegisterMutation,
} from '~/store/rtk/api/auth.api';
import { baseApi } from '~/store/rtk/api/baseApi';
import {
  selectIsSignUpModalOpen,
  setIsSignUpModalOpen,
} from '~/store/rtk/slices/modals.slice';
import {
  selectUnregisteredFollowedShows,
  setIsLoggedIn,
} from '~/store/rtk/slices/user.slice';
import { emailRegex } from '~/utils/constants';
import handleErrors from '~/utils/handleErrors';
import { isFetchError } from '~/utils/isFetchError';

import GoogleLoginButton from './GoogleLoginButton';

type FormInputs = {
  email: string;
  password: string;
  confirmPassword: string;
};

const formValidation = {
  email: {
    required: { value: true, message: 'Email is required' },
    pattern: { value: emailRegex, message: 'Please enter a valid email' },
  },
  password: {
    required: 'Password is required',
  },
  confirmPassword: {
    required: 'Confirm password is required',
    validate: (value: string, formValues: FormInputs) => {
      if (value !== formValues.password) {
        return 'Passwords do not match';
      }
      return true;
    },
  },
};

const SignUpModal = () => {
  const dispatch = useAppDispatch();
  const unregisteredFollowedShows = useAppSelector(
    selectUnregisteredFollowedShows
  );
  const isMobile = useIsMobile();

  // Modal
  const isOpen = useAppSelector(selectIsSignUpModalOpen);
  const onClose = () => dispatch(setIsSignUpModalOpen(false));

  // RTK Query mutations
  const [registerUser, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const isSubmitLoading = isRegisterLoading || isLoginLoading;

  // Form
  const {
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    register,
    reset: resetForm,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        resetForm();
        dispatch(baseApi.util.resetApiState());
      });
    }
  }, [isOpen, resetForm, dispatch]);

  const onSubmit = handleSubmit(async ({ email, password }: FormInputs) => {
    try {
      await registerUser({
        email,
        password,
        unregisteredFollowedShows,
      }).unwrap();
      const res = await login({ email, password }).unwrap();
      localStorage.setItem('jwt', res.token);
      onClose();
      dispatch(setIsLoggedIn({ email: res.email }));
    } catch (err) {
      reset(undefined, { keepErrors: true });
      const is409Error = isFetchError(err) && err.status === 409;
      if (is409Error) {
        setError('root', {
          type: 'manual',
          message: 'Email already registered. Please try again.',
        });
      } else {
        handleErrors(err);
        setError('root', {
          type: 'manual',
          message: 'Could not sign up. Please try again.',
        });
      }
    }
  });

  const handleFormClose = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog.Root
      onOpenChange={e => handleFormClose(e.open)}
      open={isOpen}
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="bg.muted">
          <Dialog.Header>
            <Dialog.Title>Sign Up</Dialog.Title>
          </Dialog.Header>

          <Dialog.CloseTrigger asChild>
            <CloseButton color="fg.muted" />
          </Dialog.CloseTrigger>

          {/* Since this component throws an error if it doesn't have the google
            secret key, don't render it during playweright tests. This allows us
            to run e2e tests for other users' PRs since forks don't have that key. */}
          {import.meta.env.VITE_CI !== 'true' && <GoogleLoginButton />}

          <Box as="form" onSubmit={onSubmit}>
            <Dialog.Body pb={6}>
              <InlineTextSeparator
                alignItems="center"
                fontSize="14px"
                m="26px 0"
                textAlign="center"
              >
                OR
              </InlineTextSeparator>

              <Field.Root invalid={!!errors?.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  _focus={{ borderColor: 'cyan.500' }}
                  borderColor="gray.500"
                  {...register('email', { ...formValidation.email })}
                  autoFocus={!isMobile}
                />
                <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors?.password} mt={4}>
                <Field.Label>Password</Field.Label>
                <PasswordInput
                  _focus={{ borderColor: 'cyan.500' }}
                  borderColor="gray.500"
                  {...register('password', { ...formValidation.password })}
                />
                <Field.ErrorText>{errors?.password?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors?.confirmPassword} mt={4}>
                <Field.Label>Confirm Password</Field.Label>
                <PasswordInput
                  _focus={{ borderColor: 'cyan.500' }}
                  borderColor="gray.500"
                  {...register('confirmPassword', {
                    ...formValidation.confirmPassword,
                  })}
                />
                <Field.ErrorText>
                  {errors?.confirmPassword?.message}
                </Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={!!errors?.root} mt={4}>
                <Field.ErrorText>{errors?.root?.message}</Field.ErrorText>
              </Field.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Button color="fg.muted" mr={3} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                colorPalette="cyan"
                loading={isSubmitLoading}
                type="submit"
                variant="solid"
              >
                Sign Up
              </Button>
            </Dialog.Footer>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default SignUpModal;
