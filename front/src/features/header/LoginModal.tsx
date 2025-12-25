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
import ky, { HTTPError } from 'ky';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TiArrowBack } from 'react-icons/ti';

import ENDPOINTS from '~/app/endpoints';
import InlineTextSeparator from '~/components/InlineTextSeparator';
import { PasswordInput } from '~/components/ui/password-input';
import { showToast } from '~/components/ui/toaster';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '~/store';
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
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const isOpen = useAppSelector(selectIsLoginModalOpen);
  const onClose = () => dispatch(setIsLoginModalOpen(false));

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
  const [formOption, setFormOption] = useState(0);

  const onSubmit = handleSubmit(
    ({ email, password, oneTimeCode }: FormInputs) => {
      setIsSubmitLoading(true);
      switch (formOption) {
        case 0:
          handleLogin(email, password);
          break;
        case 1:
          requestGenerateOneTimeCode(email);
          break;
        case 2:
          requestVerifyOneTimeCode(email, oneTimeCode);
          break;
        case 3:
          requestChangePassword(email, password);
          break;
      }
    }
  );

  const handleLogin = (email: string, password: string) => {
    ky.post(`${ENDPOINTS.TV_MINDER_SERVER}/login`, {
      json: { email, password },
    })
      .json<{ token: string; email: string }>()
      .then(res => {
        localStorage.setItem('jwt', res.token);
        onClose();
        dispatch(setIsLoggedIn({ email: res.email }));
      })
      .catch((err: HTTPError) => {
        handleErrors(err);
        setIsSubmitLoading(false);
        setError('root', {
          type: 'manual',
          message: 'Invalid login. Please try again.',
        });
        setValue('password', '');
      });
  };

  const requestGenerateOneTimeCode = (email: string) => {
    ky.post(`${ENDPOINTS.TV_MINDER_SERVER}/requestonetimecode`, {
      json: { email },
    })
      .then(() => {
        setIsSubmitLoading(false);
        setFormOption(2);
      })
      .catch((err: HTTPError) => {
        handleErrors(err);
        setIsSubmitLoading(false);
        setError('root', {
          type: 'manual',
          message: 'The email is not registered',
        });
      });
  };

  const requestVerifyOneTimeCode = (email: string, oneTimeCode: string) => {
    ky.post(`${ENDPOINTS.TV_MINDER_SERVER}/verifyonetimecode`, {
      json: { email, oneTimeCode },
    })
      .then(() => {
        setIsSubmitLoading(false);
        setFormOption(3);
      })
      .catch((err: HTTPError) => {
        handleErrors(err);
        setIsSubmitLoading(false);
        setError('root', {
          type: 'manual',
          message: 'Invalid One Time Code',
        });
      });
  };

  const requestChangePassword = (email: string, password: string) => {
    ky.post(`${ENDPOINTS.TV_MINDER_SERVER}/changepasswordforreset`, {
      json: { email, password },
    })
      .then(() => {
        setIsSubmitLoading(false);
        setFormOption(0);
        showToast({
          title: 'Password Changed',
          description: 'You can login with your new password',
          type: 'success',
        });
      })
      .catch((err: HTTPError) => {
        handleErrors(err);
        setIsSubmitLoading(false);
        setError('root', {
          type: 'manual',
          message: 'Unable to change password',
        });
      });
  };

  const handleFormClose = (isOpen: boolean) => {
    if (!isOpen) {
      setFormOption(0);
      onClose();
      resetForm();
    }
  };

  const getSubmitButtonText = () => {
    let buttonText;
    if (formOption === 0) {
      buttonText = 'Login';
    } else if (formOption === 1) {
      buttonText = 'Send Code';
    } else if (formOption === 2) {
      buttonText = 'Verify';
    } else if (formOption === 3) {
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
                {formOption === 0 ? 'Login' : 'Forgot Password'}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.CloseTrigger asChild>
              <CloseButton />
            </Dialog.CloseTrigger>

            {/* Since this component throws an error if it doesn't have the google
            secret key, don't render it during playweright tests. This allows us
            to run e2e tests for other users' PRs since forks don't have that key. */}
            {formOption === 0 && import.meta.env.VITE_CI !== 'true' && (
              <GoogleLoginButton />
            )}

            <Box as="form" onSubmit={onSubmit}>
              <Dialog.Body pb={6}>
                {formOption === 0 && (
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
                    disabled={formOption === 2 || formOption === 3}
                    {...register('email', { ...formValidation.email })}
                    autoFocus={!isMobile}
                  />
                  <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
                </Field.Root>

                {(formOption === 0 || formOption === 3) && (
                  <Field.Root invalid={!!errors?.password} mt={4}>
                    <Field.Label>
                      {formOption === 3 && 'New'} Password
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

                {formOption === 2 && (
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
                  {(formOption === 0 || formOption === 1) && (
                    <Button
                      fontSize="0.88rem"
                      onClick={() => {
                        setValue('email', '');
                        setValue('password', '');
                        setFormOption((formOption + 1) % 2);
                      }}
                      px={0}
                      variant="plain"
                    >
                      {formOption === 0 ? (
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
