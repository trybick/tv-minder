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
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TiArrowBack } from 'react-icons/ti';
import { connect, MapStateToProps } from 'react-redux';

import Separator from '~/components/common/Separator';
import ENDPOINTS from '~/constants/endpoints';
import { useCloseModalOnPressEscape } from '~/hooks/useCloseModalOnPressEscape';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from '~/store';
import {
  setIsLoggedInAction,
  unregisteredClearFollowedShowsAction,
} from '~/store/user/actions';
import { DisclosureProps } from '~/types/common';
import handleErrors from '~/utils/handleErrors';

import { emailRegex } from '../../../constants/strings';
import { PasswordInput } from '../../ui/password-input';
import { toaster } from '../../ui/toaster';

import GoogleLoginButton from './GoogleLoginButton';

type OwnProps = {
  disclosureProps: DisclosureProps;
};

type DispatchProps = {
  setIsLoggedIn: (email: string) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
};

type Props = OwnProps & DispatchProps;

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

const LoginModal = ({
  disclosureProps,
  setIsLoggedIn,
  unregisteredClearFollowedShows,
}: Props) => {
  // Modal
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose } = disclosureProps;
  useCloseModalOnPressEscape({ onClose });

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
      setIsLoading(true);
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
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/login`, {
        email,
        password,
      })
      .then(res => {
        localStorage.setItem('jwt', res.data.token);
        onClose();
        setIsLoggedIn(res.data.email);
        unregisteredClearFollowedShows();
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        setError('root', {
          type: 'manual',
          message: 'Invalid login. Please try again.',
        });
        setValue('password', '');
      });
  };

  const requestGenerateOneTimeCode = (email: string) => {
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/requestonetimecode`, { email })
      .then(() => {
        setIsLoading(false);
        setFormOption(2);
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        setError('root', {
          type: 'manual',
          message: 'The email is not registered',
        });
      });
  };

  const requestVerifyOneTimeCode = (email: string, oneTimeCode: string) => {
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/verifyonetimecode`, {
        email,
        oneTimeCode,
      })
      .then(() => {
        setIsLoading(false);
        setFormOption(3);
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        setError('root', {
          type: 'manual',
          message: 'Invalid One Time Code',
        });
      });
  };

  const requestChangePassword = (email: string, password: string) => {
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/changepasswordforreset`, {
        email,
        password,
      })
      .then(() => {
        setIsLoading(false);
        setFormOption(0);
        toaster.create({
          title: 'Password Changed',
          description: 'You can login with your new password',
          type: 'success',
          duration: 5000,
          meta: { closable: true },
        });
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
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

            {formOption === 0 && (
              <GoogleLoginButton
                onClose={onClose}
                setIsLoggedIn={setIsLoggedIn}
                unregisteredClearFollowedShows={unregisteredClearFollowedShows}
              />
            )}

            <Box as="form" onSubmit={onSubmit}>
              <Dialog.Body pb={6}>
                {formOption === 0 && (
                  <Separator
                    alignItems="center"
                    fontSize="14px"
                    m="26px 0"
                    textAlign="center"
                  >
                    OR
                  </Separator>
                )}

                <Field.Root invalid={!!errors?.email}>
                  <Field.Label htmlFor="email">Email</Field.Label>
                  <Input
                    _focus={{ borderColor: 'cyan.500' }}
                    borderColor="gray.500"
                    disabled={formOption === 2 || formOption === 3}
                    {...register('email', { ...formValidation.email })}
                    autoFocus
                  />
                  <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
                </Field.Root>

                {(formOption === 0 || formOption === 3) && (
                  <Field.Root invalid={!!errors?.password} mt={4}>
                    <Field.Label>
                      {' '}
                      {formOption === 3 && 'New'} Password
                    </Field.Label>
                    <PasswordInput
                      _focus={{ borderColor: 'cyan.500' }}
                      borderColor="gray.500"
                      {...register('password', { ...formValidation.password })}
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
                    loading={isLoading}
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

const mapStateToProps: MapStateToProps<{}, OwnProps, AppState> = () => ({});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedIn: (email: string, isGoogleUser = false) =>
    dispatch(setIsLoggedInAction(email, isGoogleUser)),
  unregisteredClearFollowedShows: () =>
    dispatch(unregisteredClearFollowedShowsAction()),
});

export default connect<{}, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
