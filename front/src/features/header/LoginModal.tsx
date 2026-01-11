import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
  Portal,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TiArrowBack } from 'react-icons/ti';

import InlineTextSeparator from '~/components/InlineTextSeparator';
import { PasswordInput } from '~/components/ui/password-input';
import { showToast } from '~/components/ui/toaster';
import { useIsMobile } from '~/hooks/useIsMobile';
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
} from '~/store/rtk/slices/modals.slice';
import { setIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { emailRegex } from '~/utils/constants';
import handleErrors from '~/utils/handleErrors';

import GoogleLoginButton from './GoogleLoginButton';

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

const LoginModal = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();

  // Modal
  const isOpen = useAppSelector(selectIsLoginModalOpen);
  const onClose = () => dispatch(setIsLoginModalOpen(false));

  // RTK Query mutations
  const [login, { isLoading: isLoginLoading, reset: resetLogin }] =
    useLoginMutation();
  const [
    requestOneTimeCode,
    { isLoading: isRequestCodeLoading, reset: resetRequestCode },
  ] = useRequestOneTimeCodeMutation();
  const [
    verifyOneTimeCode,
    { isLoading: isVerifyCodeLoading, reset: resetVerifyCode },
  ] = useVerifyOneTimeCodeMutation();
  const [
    changePasswordForReset,
    { isLoading: isChangePasswordLoading, reset: resetChangePassword },
  ] = useChangePasswordForResetMutation();

  const isSubmitLoading =
    isLoginLoading ||
    isRequestCodeLoading ||
    isVerifyCodeLoading ||
    isChangePasswordLoading;

  // Form
  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
    setValue,
    reset: resetForm,
  } = useForm<FormInputs>();

  // Forgot Password
  const [currentFormOption, setCurrentFormOption] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        setCurrentFormOption(0);
        resetForm();
        resetLogin();
        resetRequestCode();
        resetVerifyCode();
        resetChangePassword();
      });
    }
  }, [
    isOpen,
    resetForm,
    resetLogin,
    resetRequestCode,
    resetVerifyCode,
    resetChangePassword,
  ]);

  const onSubmit = handleSubmit(
    async ({ email, password, oneTimeCode }: FormInputs) => {
      switch (currentFormOption) {
        case 0:
          await handleLogin(email, password);
          break;
        case 1:
          await handleRequestGenerateOneTimeCode(email);
          break;
        case 2:
          await handleVerifyOneTimeCode(email, oneTimeCode);
          break;
        case 3:
          await handleChangePassword(email, password);
          break;
      }
    }
  );

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await login({ email, password }).unwrap();
      localStorage.setItem('jwt', res.token);
      onClose();
      dispatch(setIsLoggedIn({ email: res.email }));
    } catch (err) {
      handleErrors(err);
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
      setCurrentFormOption(2);
    } catch (err) {
      handleErrors(err);
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
      setCurrentFormOption(3);
    } catch (err) {
      handleErrors(err);
      setError('root', {
        type: 'manual',
        message: 'Invalid One Time Code',
      });
    }
  };

  const handleChangePassword = async (email: string, password: string) => {
    try {
      await changePasswordForReset({ email, password }).unwrap();
      setCurrentFormOption(0);
      showToast({
        title: 'Password Changed',
        description: 'You can login with your new password',
        type: 'success',
      });
    } catch (err) {
      handleErrors(err);
      setError('root', {
        type: 'manual',
        message: 'Unable to change password',
      });
    }
  };

  const handleFormClose = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  const getSubmitButtonText = () => {
    let buttonText;
    if (currentFormOption === 0) {
      buttonText = 'Login';
    } else if (currentFormOption === 1) {
      buttonText = 'Send Code';
    } else if (currentFormOption === 2) {
      buttonText = 'Verify';
    } else if (currentFormOption === 3) {
      buttonText = 'Change Password';
    }
    return buttonText;
  };

  return (
    <Dialog.Root
      onOpenChange={e => handleFormClose(e.open)}
      open={isOpen}
      lazyMount
      unmountOnExit
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="bg.muted">
            <Dialog.Header>
              <Dialog.Title>
                {currentFormOption === 0 ? 'Login' : 'Forgot Password'}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.CloseTrigger asChild>
              <CloseButton color="fg.muted" />
            </Dialog.CloseTrigger>

            {/* Since this component throws an error if it doesn't have the google
            secret key, don't render it during playweright tests. This allows us
            to run e2e tests for other users' PRs since forks don't have that key. */}
            {currentFormOption === 0 && import.meta.env.VITE_CI !== 'true' && (
              <GoogleLoginButton />
            )}

            <Box as="form" onSubmit={onSubmit}>
              <Dialog.Body pb={6}>
                {currentFormOption === 0 && (
                  <InlineTextSeparator
                    alignItems="center"
                    fontSize="14px"
                    m="26px 0"
                    textAlign="center"
                  >
                    OR
                  </InlineTextSeparator>
                )}

                <Field.Root invalid={!!errors?.email}>
                  <Field.Label>Email</Field.Label>
                  <Input
                    _focus={{ borderColor: 'cyan.500' }}
                    borderColor="gray.500"
                    disabled={
                      currentFormOption === 2 || currentFormOption === 3
                    }
                    {...register('email', { ...formValidation.email })}
                    autoFocus={!isMobile}
                  />
                  <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
                </Field.Root>

                {(currentFormOption === 0 || currentFormOption === 3) && (
                  <Field.Root invalid={!!errors?.password} mt={4}>
                    <Field.Label>
                      {currentFormOption === 3 && 'New'} Password
                    </Field.Label>
                    <PasswordInput
                      _focus={{ borderColor: 'cyan.500' }}
                      borderColor="gray.500"
                      {...register('password', {
                        ...formValidation.password,
                      })}
                    />
                    <Field.ErrorText>
                      {errors?.password?.message}
                    </Field.ErrorText>
                  </Field.Root>
                )}

                {currentFormOption === 2 && (
                  <Field.Root invalid={!!errors?.oneTimeCode} mt={4}>
                    <Field.Label>Enter Verification Code</Field.Label>
                    <Input
                      {...register('oneTimeCode', {
                        ...formValidation.oneTimeCode,
                      })}
                    />
                    <Field.ErrorText>
                      {errors?.oneTimeCode?.message}
                    </Field.ErrorText>
                  </Field.Root>
                )}

                <Field.Root invalid={!!errors?.root} mt={4}>
                  <Field.ErrorText>{errors?.root?.message}</Field.ErrorText>
                </Field.Root>
              </Dialog.Body>

              <Dialog.Footer as={Flex} flex={1} justifyContent="space-between">
                <Box>
                  {(currentFormOption === 0 || currentFormOption === 1) && (
                    <Button
                      fontSize="0.88rem"
                      onClick={() => {
                        setValue('email', '');
                        setValue('password', '');
                        setCurrentFormOption((currentFormOption + 1) % 2);
                      }}
                      px={0}
                      variant="plain"
                      color="fg.muted"
                    >
                      {currentFormOption === 0 ? (
                        'Forgot Password?'
                      ) : (
                        <>
                          <Box as={TiArrowBack} />
                          Back
                        </>
                      )}
                    </Button>
                  )}
                </Box>

                <Box>
                  <Button
                    color="fg.muted"
                    onClick={() => handleFormClose(false)}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button
                    colorPalette="cyan"
                    loading={isSubmitLoading}
                    ml={3}
                    type="submit"
                    variant="solid"
                  >
                    {getSubmitButtonText()}
                  </Button>
                </Box>
              </Dialog.Footer>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default LoginModal;
