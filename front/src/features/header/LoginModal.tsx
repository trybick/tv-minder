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
import { baseApi } from '~/store/rtk/api/baseApi';
import { selectIsLoginModalOpen } from '~/store/rtk/slices/modals.slice';
import { emailRegex } from '~/utils/constants';
import { getMessageFromError } from '~/utils/getMessageFromError';

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

  const [formMode, setFormMode] = useState(0);

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
    reset: resetForm,
  } = useForm<FormInputs>();

  useEffect(() => {
    if (!isOpen) {
      queueMicrotask(() => {
        setFormMode(0);
        resetForm();
        dispatch(baseApi.util.resetApiState());
      });
    }
  }, [isOpen, resetForm, dispatch]);

  const onSubmit = handleSubmit(
    async ({ email, password, oneTimeCode }: FormInputs) => {
      switch (formMode) {
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
      await login({ email, password }).unwrap();
    } catch (err) {
      getMessageFromError(err);
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
      setFormMode(2);
    } catch (err) {
      getMessageFromError(err);
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
      setFormMode(3);
    } catch (err) {
      getMessageFromError(err);
      setError('root', {
        type: 'manual',
        message: 'Invalid One Time Code',
      });
    }
  };

  const handleChangePassword = async (email: string, password: string) => {
    try {
      await changePasswordForReset({ email, password }).unwrap();
      setFormMode(0);
      showToast({
        title: 'Password Changed',
        description: 'You can login with your new password',
        type: 'success',
      });
    } catch (err) {
      getMessageFromError(err);
      setError('root', {
        type: 'manual',
        message: 'Unable to change password',
      });
    }
  };

  const getSubmitButtonText = () => {
    let buttonText;
    if (formMode === 0) {
      buttonText = 'Login';
    } else if (formMode === 1) {
      buttonText = 'Send Code';
    } else if (formMode === 2) {
      buttonText = 'Verify';
    } else if (formMode === 3) {
      buttonText = 'Change Password';
    }
    return buttonText;
  };

  return (
    <Dialog.Root
      onOpenChange={e => !e.open && dispatch(baseApi.util.resetApiState())}
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
                {formMode === 0 ? 'Login' : 'Forgot Password'}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.CloseTrigger asChild>
              <CloseButton color="fg.muted" />
            </Dialog.CloseTrigger>

            {/* Since this component throws an error if it doesn't have the google
            secret key, don't render it during playweright tests. This allows us
            to run e2e tests for other users' PRs since forks don't have that key. */}
            {formMode === 0 && import.meta.env.VITE_CI !== 'true' && (
              <GoogleLoginButton />
            )}

            <Box as="form" onSubmit={onSubmit}>
              <Dialog.Body pb={6}>
                {formMode === 0 && (
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
                    disabled={formMode === 2 || formMode === 3}
                    {...register('email', { ...formValidation.email })}
                    autoFocus={!isMobile}
                  />
                  <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
                </Field.Root>

                {(formMode === 0 || formMode === 3) && (
                  <Field.Root invalid={!!errors?.password} mt={4}>
                    <Field.Label>
                      {formMode === 3 && 'New'} Password
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

                {formMode === 2 && (
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
                  {(formMode === 0 || formMode === 1) && (
                    <Button
                      fontSize="0.88rem"
                      onClick={() => {
                        setValue('email', '');
                        setValue('password', '');
                        setFormMode((formMode + 1) % 2);
                      }}
                      px={0}
                      variant="plain"
                      color="fg.muted"
                    >
                      {formMode === 0 ? (
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
                  <Dialog.CloseTrigger asChild>
                    <Button color="fg.muted" variant="ghost">
                      Cancel
                    </Button>
                  </Dialog.CloseTrigger>
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
