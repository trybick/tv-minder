import { useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Grid,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { TiArrowBack } from 'react-icons/ti';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { setIsLoggedInAction, unregisteredClearFollowedShowsAction } from 'store/user/actions';
import ENDPOINTS from 'constants/endpoints';
import handleErrors from 'utils/handleErrors';
import { DisclosureProps } from 'types/common';
import { useCloseModalOnPressEscape } from 'hooks/useCloseModalOnPressEscape';
import GoogleLoginButton from './GoogleLoginButton';
import { toaster } from '../../ui/toaster';

type OwnProps = {
  disclosureProps: DisclosureProps;
};

type DispatchProps = {
  setIsLoggedIn: (email: string) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
};

type Props = OwnProps & DispatchProps;

type FormData = {
  email: string;
  password: string;
  oneTimeCode: string;
  login?: string;
};

const Separator = styled(Flex)`
  &:before,
  &:after {
    content: '';
    flex: 1;
    border-bottom: 1px solid grey;
  }
  &:before {
    margin-right: 15px;
  }
  &:after {
    margin-left: 15px;
  }
`;

const LoginModal = ({ disclosureProps, setIsLoggedIn, unregisteredClearFollowedShows }: Props) => {
  // Modal
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose } = disclosureProps;
  useCloseModalOnPressEscape({ onClose });

  // Form
  const { clearError, handleSubmit, errors, register, setError, setValue } = useForm<FormData>();

  // Password fields
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);

  // Forgot Password
  const [formOption, setFormOption] = useState(0);

  const onSubmit = handleSubmit(({ email, password, oneTimeCode }: FormData) => {
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
  });

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
        toaster.create({
          title: 'Login Successful',
          description: 'You are now logged in.',
          type: 'success',
          duration: 3000,
          closable: true,
        });
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        setError('login', 'generic', 'Invalid login. Please try again.');
        setValue('password', '');
      });
  };

  const requestGenerateOneTimeCode = (email: string) => {
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/requestonetimecode`, { email })
      .then(() => {
        setIsLoading(false);
        setFormOption(2);
        toaster.create({
          title: 'Password Reset!',
          description: 'A one-time code has been sent to your email address',
          type: 'success',
          duration: 3000,
          closable: true,
        });
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        setError('login', 'generic', 'The email is not registered');
      });
  };

  const requestVerifyOneTimeCode = (email: string, oneTimeCode: string) => {
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/verifyonetimecode`, { email, oneTimeCode })
      .then(() => {
        setIsLoading(false);
        setFormOption(3);
        toaster.create({
          title: 'Verification Completed!',
          description: 'Time to change your password',
          type: 'success',
          duration: 3000,
          closable: true,
        });
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        setError('login', 'generic', 'Invalid One Time Code');
      });
  };

  const requestChangePassword = (email: string, password: string) => {
    axios
      .post(`${ENDPOINTS.TV_MINDER_SERVER}/changepasswordforreset`, { email, password })
      .then(() => {
        setIsLoading(false);
        setFormOption(0);
        toaster.create({
          title: 'Password Changed!',
          description: 'Login with your new password',
          type: 'success',
          duration: 3000,
          closable: true,
        });
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        setError('login', 'generic', 'Unable to change password');
      });
  };

  const handleFormClose = () => {
    setFormOption(0);
    onClose();
  };

  const getSubmitButtonText = () => {
    let buttonText;
    if (formOption === 0) {
      buttonText = 'Login';
    } else if (formOption === 1) {
      buttonText = 'Send One-time Code';
    } else if (formOption === 2) {
      buttonText = 'Verify';
    } else if (formOption === 3) {
      buttonText = 'Change Password';
    }
    return buttonText;
  };

  return (
    <Dialog.Root onOpenChange={handleFormClose} open={isOpen}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>Login</Dialog.Header>

          <Dialog.CloseTrigger asChild>
            <CloseButton
              onClick={() => {
                clearError();
                onClose();
              }}
              size="sm"
            />
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
                <Separator alignItems="center" fontSize="14px" m="26px 0" textAlign="center">
                  OR
                </Separator>
              )}

              <Field.Root invalid={Boolean(errors?.email)}>
                <Field.Label htmlFor="email">Email</Field.Label>
                <Input
                  disabled={formOption === 2 || formOption === 3}
                  placeholder="Email"
                  {...register('email')}
                  autoFocus
                />
                <Field.ErrorText>{errors?.email?.message}</Field.ErrorText>
              </Field.Root>
              {(formOption === 0 || formOption === 3) && (
                <Field.Root invalid={Boolean(errors?.password)} mt={4}>
                  <Field.Label> {formOption === 3 && 'New'} Password</Field.Label>
                  <InputGroup
                    endElement={
                      <Button h="1.75rem" onClick={togglePasswordVisible} size="sm" tabIndex={-1}>
                        {passwordVisible ? 'Hide' : 'Show'}
                      </Button>
                    }
                  >
                    <Input
                      placeholder="Password"
                      {...register('password')}
                      type={passwordVisible ? 'text' : 'password'}
                    />
                  </InputGroup>
                  <Field.ErrorText>{errors?.password?.message}</Field.ErrorText>
                </Field.Root>
              )}
              {formOption === 2 && (
                <Field.Root invalid={Boolean(errors?.oneTimeCode)} mt={4}>
                  <Field.Label>Enter Verification Code</Field.Label>
                  <Input placeholder="One Time Code" {...register('oneTimeCode')} />
                  <Field.ErrorText>{errors?.oneTimeCode?.message}</Field.ErrorText>
                </Field.Root>
              )}
              <Field.Root invalid={Boolean(errors?.login)} mt={4}>
                <Field.ErrorText>{errors?.login?.message}</Field.ErrorText>
              </Field.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <Box>
                <Flex flex={1}>
                  <Grid gridTemplateColumns="1fr 3fr">
                    <Box textAlign="left">
                      {(formOption === 0 || formOption === 1) && (
                        <Button
                          _active={{
                            borderColor: 'none',
                          }}
                          _focus={{
                            borderColor: 'none',
                          }}
                          color="#659BC7"
                          fontSize="0.88rem"
                          onClick={() => setFormOption((formOption + 1) % 2)}
                          pt="0.75rem"
                          // variant="link"
                        >
                          {(formOption === 0 && 'Forgot Password?') ||
                            (formOption === 1 && (
                              <>
                                <Box as={TiArrowBack} w="18px" />
                                Go back
                              </>
                            ))}
                        </Button>
                      )}
                    </Box>

                    <Box textAlign="right">
                      <Button bg="primary" color="white" loading={isLoading} type="submit">
                        {getSubmitButtonText()}
                      </Button>
                      <Button ml={2} onClick={handleFormClose}>
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Flex>
              </Box>
            </Dialog.Footer>
          </Box>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

const mapStateToProps: MapStateToProps<{}, OwnProps, AppState> = () => ({});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedIn: (email: string, isGoogleUser = false) =>
    dispatch(setIsLoggedInAction(email, isGoogleUser)),
  unregisteredClearFollowedShows: () => dispatch(unregisteredClearFollowedShowsAction()),
});

export default connect<{}, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
