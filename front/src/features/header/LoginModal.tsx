import { chakra, Dialog, Field, Flex, Portal, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LuArrowLeft } from 'react-icons/lu';

import { showToast } from '~/components/ui/toaster';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppDispatch, useAppSelector } from '~/store';
import {
  useChangePasswordForResetMutation,
  useLoginMutation,
  useRequestOneTimeCodeMutation,
  useVerifyOneTimeCodeMutation,
} from '~/store/rtk/api/auth.api';
import {
  selectIsLoginModalOpen,
  setIsLoginModalOpen,
  setIsSignUpModalOpen,
} from '~/store/rtk/slices/modals.slice';
import { trackEvent } from '~/utils/analytics';
import { emailRegex } from '~/utils/constants';
import { handleRtkQueryError } from '~/utils/handleRtkQueryError';
import { releasePasswordManager } from '~/utils/passwordManagerIgnore';

import { GoogleLoginButton } from './GoogleLoginButton';
import { AuthDialogContent } from './auth/AuthDialogContent';
import { AuthDivider } from './auth/AuthDivider';
import { AuthFormError } from './auth/AuthFormError';
import { AuthInput, AuthPasswordInput } from './auth/AuthInputs';
import { AuthSubmitButton } from './auth/AuthSubmitButton';
import { AuthSwitchPrompt } from './auth/AuthSwitchPrompt';
import { AuthTextButton } from './auth/AuthTextButton';

type FormInputs = {
  email: string;
  password: string;
  oneTimeCode: string;
};

const formValidation = {
  email: {
    required: { value: true, message: 'Email is required' },
    pattern: { value: emailRegex, message: 'Please enter a valid email' },
  },
  password: {
    required: 'Password is required',
  },
  oneTimeCode: {
    required: 'One time code is required',
  },
};

const FormModes = {
  Login: 'login',
  ForgotPassword: 'forgotPassword',
  VerifyCode: 'verifyCode',
  ChangePassword: 'changePassword',
} as const;

type FormMode = (typeof FormModes)[keyof typeof FormModes];

const formCopy: Record<
  FormMode,
  { title: string; description: string; submitLabel: string }
> = {
  [FormModes.Login]: {
    title: 'Welcome back',
    description: 'Log in to pick up where you left off.',
    submitLabel: 'Login',
  },
  [FormModes.ForgotPassword]: {
    title: 'Reset your password',
    description: "Enter your email and we'll send you a one-time code.",
    submitLabel: 'Send Code',
  },
  [FormModes.VerifyCode]: {
    title: 'Check your inbox',
    description: 'Enter the verification code we just emailed you.',
    submitLabel: 'Verify',
  },
  [FormModes.ChangePassword]: {
    title: 'Choose a new password',
    description: 'Pick something secure that you will remember.',
    submitLabel: 'Change Password',
  },
};

export const LoginModal = () => {
  const { isMobile } = useResponsiveLayout();
  const dispatch = useAppDispatch();

  const [formMode, setFormMode] = useState<FormMode>(FormModes.Login);

  const isOpen = useAppSelector(selectIsLoginModalOpen);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [requestOneTimeCode, { isLoading: isRequestCodeLoading }] =
    useRequestOneTimeCodeMutation();
  const [verifyOneTimeCode, { isLoading: isVerifyCodeLoading }] =
    useVerifyOneTimeCodeMutation();
  const [changePasswordForReset, { isLoading: isChangePasswordLoading }] =
    useChangePasswordForResetMutation();

  const isSubmitLoading =
    isLoginLoading ||
    isRequestCodeLoading ||
    isVerifyCodeLoading ||
    isChangePasswordLoading;

  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
    setValue,
    clearErrors,
    reset: resetForm,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        setFormMode(FormModes.Login);
        resetForm();
      });
    }
  }, [isOpen, resetForm]);

  const onSubmit = handleSubmit(
    async ({ email, password, oneTimeCode }: FormInputs) => {
      switch (formMode) {
        case FormModes.Login:
          trackEvent({ category: 'Auth', action: 'Login Form Submitted' });
          await handleLogin(email, password);
          break;
        case FormModes.ForgotPassword:
          await handleRequestGenerateOneTimeCode(email);
          break;
        case FormModes.VerifyCode:
          await handleVerifyOneTimeCode(email, oneTimeCode);
          break;
        case FormModes.ChangePassword:
          await handleChangePassword(email, password);
          break;
      }
    }
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password }).unwrap();
    } catch (err) {
      handleRtkQueryError(err);
      setError('root', {
        type: 'manual',
        message: 'Invalid login. Please try again.',
      });
      setValue('password', '');
    }
  };

  const handleRequestGenerateOneTimeCode = async (email: string) => {
    try {
      await requestOneTimeCode({ email }).unwrap();
      setFormMode(FormModes.VerifyCode);
    } catch (err) {
      handleRtkQueryError(err);
      setError('root', {
        type: 'manual',
        message: 'The email is not registered',
      });
    }
  };

  const handleVerifyOneTimeCode = async (
    email: string,
    oneTimeCode: string
  ) => {
    try {
      await verifyOneTimeCode({ email, oneTimeCode }).unwrap();
      setFormMode(FormModes.ChangePassword);
      setValue('password', '');
    } catch (err) {
      handleRtkQueryError(err);
      setError('root', {
        type: 'manual',
        message: 'Invalid One Time Code',
      });
    }
  };

  const handleChangePassword = async (email: string, password: string) => {
    try {
      await changePasswordForReset({ email, password }).unwrap();
      setFormMode(FormModes.Login);
      showToast({
        title: 'Password Changed',
        description: 'You can login with your new password',
        type: 'success',
      });
    } catch (err) {
      handleRtkQueryError(err);
      setError('root', {
        type: 'manual',
        message: 'Unable to change password',
      });
    }
  };

  const handleClickForgotPassword = () => {
    trackEvent({
      category: 'Auth',
      action: 'Forgot Password Button Pressed',
    });
    setValue('email', '');
    setValue('password', '');
    clearErrors();
    setFormMode(FormModes.ForgotPassword);
  };

  const handleClickBackToLogin = () => {
    setValue('email', '');
    setValue('password', '');
    setValue('oneTimeCode', '');
    clearErrors();
    setFormMode(FormModes.Login);
  };

  const handleClickSwitchToSignUp = () => {
    releasePasswordManager();
    dispatch(setIsLoginModalOpen(false));
    dispatch(setIsSignUpModalOpen(true));
  };

  const isLoginMode = formMode === FormModes.Login;
  const isEmailLocked =
    formMode === FormModes.VerifyCode || formMode === FormModes.ChangePassword;
  const { title, description, submitLabel } = formCopy[formMode];

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={e => {
        if (!e.open) {
          releasePasswordManager();
        }
        dispatch(setIsLoginModalOpen(e.open));
      }}
      lazyMount
      unmountOnExit
    >
      {isOpen ? (
        <Portal>
          <Dialog.Backdrop pointerEvents={isOpen ? 'auto' : 'none'} />
          <Dialog.Positioner>
          <AuthDialogContent title={title} description={description}>
            <chakra.form noValidate onSubmit={onSubmit}>
              <Dialog.Body pt="4" pb="6">
                {/* Since this component throws an error if it doesn't have the google
                secret key, don't render it during playweright tests. This allows us
                to run e2e tests for other users' PRs since forks don't have that key. */}
                {isLoginMode && import.meta.env.VITE_CI !== 'true' && (
                  <>
                    <GoogleLoginButton />
                    <AuthDivider>or continue with email</AuthDivider>
                  </>
                )}

                <Stack gap="4">
                  <Field.Root invalid={!!errors?.email}>
                    <Field.Label>Email</Field.Label>
                    <AuthInput
                      type="email"
                      autoComplete={isLoginMode ? 'username' : 'email'}
                      placeholder="you@example.com"
                      disabled={isEmailLocked}
                      {...register('email', { ...formValidation.email })}
                      autoFocus={!isMobile}
                    />
                    <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
                  </Field.Root>

                  {(isLoginMode || formMode === FormModes.ChangePassword) && (
                    <Field.Root invalid={!!errors?.password}>
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        width="full"
                      >
                        <Field.Label>
                          {formMode === FormModes.ChangePassword && 'New '}
                          Password
                        </Field.Label>
                        {isLoginMode && (
                          <AuthTextButton
                            fontWeight="normal"
                            onClick={handleClickForgotPassword}
                          >
                            Forgot password?
                          </AuthTextButton>
                        )}
                      </Flex>
                      <AuthPasswordInput
                        autoComplete={
                          isLoginMode ? 'current-password' : 'new-password'
                        }
                        {...register('password', {
                          ...formValidation.password,
                        })}
                      />
                      <Field.ErrorText>
                        {errors?.password?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  )}

                  {formMode === FormModes.VerifyCode && (
                    <Field.Root invalid={!!errors?.oneTimeCode}>
                      <Field.Label>Enter Verification Code</Field.Label>
                      <AuthInput
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        letterSpacing="widest"
                        {...register('oneTimeCode', {
                          ...formValidation.oneTimeCode,
                        })}
                      />
                      <Field.ErrorText>
                        {errors?.oneTimeCode?.message}
                      </Field.ErrorText>
                    </Field.Root>
                  )}
                </Stack>

                <AuthFormError message={errors?.root?.message} />

                <AuthSubmitButton loading={isSubmitLoading}>
                  {submitLabel}
                </AuthSubmitButton>
              </Dialog.Body>

              <Dialog.Footer pt="0" pb="7" justifyContent="center">
                {isLoginMode ? (
                  <AuthSwitchPrompt
                    prompt="New to TV Minder?"
                    actionLabel="Create an account"
                    onClick={handleClickSwitchToSignUp}
                  />
                ) : (
                  <AuthTextButton onClick={handleClickBackToLogin}>
                    <LuArrowLeft />
                    Back to login
                  </AuthTextButton>
                )}
              </Dialog.Footer>
            </chakra.form>
          </AuthDialogContent>
          </Dialog.Positioner>
        </Portal>
      ) : null}
    </Dialog.Root>
  );
};
