import { chakra, Dialog, Field, Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  useLoginMutation,
  useRegisterMutation,
} from '~/store/rtk/api/auth.api';
import {
  selectIsSignUpModalOpen,
  setIsLoginModalOpen,
  setIsSignUpModalOpen,
} from '~/store/rtk/slices/modals.slice';
import { selectUnregisteredTrackedShows } from '~/store/rtk/slices/user.slice';
import { trackEvent } from '~/utils/analytics';
import { emailRegex } from '~/utils/constants';
import { handleRtkQueryError } from '~/utils/handleRtkQueryError';
import { isFetchError } from '~/utils/isFetchError';
import { releasePasswordManager } from '~/utils/passwordManagerIgnore';

import { GoogleLoginButton } from './GoogleLoginButton';
import { AuthDialogContent } from './auth/AuthDialogContent';
import { AuthDivider } from './auth/AuthDivider';
import { AuthFormError } from './auth/AuthFormError';
import { AuthInput, AuthPasswordInput } from './auth/AuthInputs';
import { AuthSubmitButton } from './auth/AuthSubmitButton';
import { AuthSwitchPrompt } from './auth/AuthSwitchPrompt';

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

export const SignUpModal = () => {
  const { isMobile } = useResponsiveLayout();
  const dispatch = useAppDispatch();

  const unregisteredTrackedShows = useAppSelector(
    selectUnregisteredTrackedShows
  );
  const isOpen = useAppSelector(selectIsSignUpModalOpen);

  const [registerUser, { isLoading: isRegisterLoading }] =
    useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const isSubmitLoading = isRegisterLoading || isLoginLoading;

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
      resetForm();
    }
  }, [isOpen, resetForm]);

  const onSubmit = handleSubmit(async ({ email, password }: FormInputs) => {
    trackEvent({ category: 'Auth', action: 'Sign Up Form Submitted' });
    try {
      await registerUser({
        email,
        password,
        unregisteredTrackedShows,
      }).unwrap();
      await login({ email, password }).unwrap();
    } catch (err) {
      reset(undefined, { keepErrors: true });
      const is409Error = isFetchError(err) && err.status === 409;
      if (is409Error) {
        setError('root', {
          type: 'manual',
          message: 'Email already registered. Please try again.',
        });
      } else {
        handleRtkQueryError(err);
        setError('root', {
          type: 'manual',
          message: 'Could not sign up. Please try again.',
        });
      }
    }
  });

  const handleClickSwitchToLogin = () => {
    releasePasswordManager();
    dispatch(setIsSignUpModalOpen(false));
    dispatch(setIsLoginModalOpen(true));
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={e => {
        if (!e.open) {
          releasePasswordManager();
        }
        dispatch(setIsSignUpModalOpen(e.open));
      }}
      lazyMount
      unmountOnExit
    >
      <Dialog.Backdrop pointerEvents={isOpen ? 'auto' : 'none'} />
      <Dialog.Positioner>
        <AuthDialogContent
          title="Create your account"
          description="Never miss an episode of the shows you love."
        >
          <chakra.form noValidate onSubmit={onSubmit}>
            <Dialog.Body pt="4" pb="6">
              {/* Since this component throws an error if it doesn't have the google
              secret key, don't render it during playweright tests. This allows us
              to run e2e tests for other users' PRs since forks don't have that key. */}
              {import.meta.env.VITE_CI !== 'true' && (
                <>
                  <GoogleLoginButton />
                  <AuthDivider>or sign up with email</AuthDivider>
                </>
              )}

              <Stack gap="4">
                <Field.Root invalid={!!errors?.email}>
                  <Field.Label>Email</Field.Label>
                  <AuthInput
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email', { ...formValidation.email })}
                    autoFocus={!isMobile}
                  />
                  <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors?.password}>
                  <Field.Label>Password</Field.Label>
                  <AuthPasswordInput
                    autoComplete="new-password"
                    {...register('password', { ...formValidation.password })}
                  />
                  <Field.ErrorText>{errors?.password?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!errors?.confirmPassword}>
                  <Field.Label>Confirm Password</Field.Label>
                  <AuthPasswordInput
                    autoComplete="new-password"
                    {...register('confirmPassword', {
                      ...formValidation.confirmPassword,
                    })}
                  />
                  <Field.ErrorText>
                    {errors?.confirmPassword?.message}
                  </Field.ErrorText>
                </Field.Root>
              </Stack>

              <AuthFormError message={errors?.root?.message} />

              <AuthSubmitButton loading={isSubmitLoading}>
                Sign Up
              </AuthSubmitButton>
            </Dialog.Body>

            <Dialog.Footer pt="0" pb="7" justifyContent="center">
              <AuthSwitchPrompt
                prompt="Already have an account?"
                actionLabel="Log in"
                onClick={handleClickSwitchToLogin}
              />
            </Dialog.Footer>
          </chakra.form>
        </AuthDialogContent>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
