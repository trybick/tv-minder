import { useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import { TiArrowBack } from 'react-icons/ti';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { setIsLoggedInAction, unregisteredClearFollowedShowsAction } from 'store/user/actions';
import ENDPOINTS from 'constants/endpoints';
import { emailRegex } from 'constants/strings';
import handleErrors from 'utils/handleErrors';
import { DisclosureProps } from 'types/common';
import { useCloseModalOnPressEscape } from 'hooks/useCloseModalOnPressEscape';
import GoogleLoginButton from './GoogleLoginButton';

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

const formSchema = {
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
  const toast = useToast();
  useCloseModalOnPressEscape({ onClose });

  // Form
  const { clearError, handleSubmit, errors, register, setError, setValue } = useForm<FormData>();

  // Password fields
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);

  // Forgot Password
  const [formOption, setFormOption] = useState(0);

  const onSubmit = handleSubmit(({ email, password, oneTimeCode }) => {
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
        toast({
          title: 'Login Successful',
          description: 'You are now logged in.',
          status: 'success',
          isClosable: true,
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
        toast({
          title: 'Password Reset!',
          description: 'A one-time code has been sent to your email address',
          status: 'success',
          isClosable: true,
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
        toast({
          title: 'Verification Completed!',
          description: 'Time to change your password',
          status: 'success',
          isClosable: true,
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
        toast({
          title: 'Password Changed!',
          description: 'Login with your new password',
          status: 'success',
          isClosable: true,
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
    <Modal isOpen={isOpen} onClose={handleFormClose}>
      <ModalOverlay />
      <ModalContent bg={useColorModeValue('#fff', '#2D3748')} mx="20px">
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton
          onClick={() => {
            clearError();
            handleFormClose();
          }}
        />
        {formOption === 0 && (
          <GoogleLoginButton
            onClose={onClose}
            setIsLoggedIn={setIsLoggedIn}
            unregisteredClearFollowedShows={unregisteredClearFollowedShows}
          />
        )}

        <Box as="form" onSubmit={onSubmit}>
          <ModalBody pb={6}>
            {formOption === 0 && (
              <Separator alignItems="center" fontSize="14px" m="26px 0" textAlign="center">
                OR
              </Separator>
            )}

            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                isDisabled={formOption === 2 || formOption === 3}
                name="email"
                placeholder="Email"
                ref={register(formSchema.email)}
                autoFocus
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            {(formOption === 0 || formOption === 3) && (
              <FormControl isInvalid={Boolean(errors.password)} mt={4}>
                <FormLabel> {formOption === 3 && 'New'} Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    placeholder="Password"
                    ref={register(formSchema.password)}
                    type={passwordVisible ? 'text' : 'password'}
                  />
                  <InputRightElement w="4.5rem">
                    <Button h="1.75rem" onClick={togglePasswordVisible} size="sm" tabIndex={-1}>
                      {passwordVisible ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
            )}
            {formOption === 2 && (
              <FormControl isInvalid={Boolean(errors.password)} mt={4}>
                <FormLabel>Enter Verification Code</FormLabel>
                <Input
                  name="oneTimeCode"
                  placeholder="One Time Code"
                  ref={register(formSchema.oneTimeCode)}
                />
                <FormErrorMessage>{errors.oneTimeCode?.message}</FormErrorMessage>
              </FormControl>
            )}
            <FormControl isInvalid={Boolean(errors.login)} mt={4}>
              <FormErrorMessage>{errors.login?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
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
                        variant="link"
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
                    <Button bg="primary" color="white" isLoading={isLoading} type="submit">
                      {getSubmitButtonText()}
                    </Button>
                    <Button ml={2} onClick={handleFormClose}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Flex>
            </Box>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
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
