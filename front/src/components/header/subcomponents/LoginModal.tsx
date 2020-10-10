import React, { useState } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/core';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { setIsLoggedInAction, unregisteredClearFollowedShowsAction } from 'store/user/actions';
import { API, emailRegex } from 'utils/constants';
import { DisclosureProps } from 'types/common';
import handleErrors from 'utils/handleErrors';

interface OwnProps {
  disclosureProps: DisclosureProps;
}

interface DispatchProps {
  setIsLoggedIn: AppThunkPlainAction;
  unregisteredClearFollowedShows: AppThunkPlainAction;
}

type Props = OwnProps & DispatchProps;

type FormData = {
  email: string;
  password: string;
  otp: string;
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
  otp: {
    required: 'OTP is required',
  },
};

const LoginModal = ({ disclosureProps, setIsLoggedIn, unregisteredClearFollowedShows }: Props) => {
  // Modal
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose } = disclosureProps;
  const toast = useToast();

  // Form
  const { clearError, handleSubmit, errors, register, setError, setValue } = useForm<FormData>();

  // Password fields
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);

  //Forgot Password
  const [formOption, setformOption] = React.useState(0);

  const onSubmit = handleSubmit(({ email, password, otp }) => {
    setIsLoading(true);
    switch (formOption) {
      case 0:
        processLogin(email, password);
        break;
      case 1:
        processOtp(email);
        break;
      case 2:
        processOtpVerification(email, otp);
        break;
      case 3:
        processChangePassword(email, password);
        break;
    }
  });

  const processLogin = (email: string, password: string) => {
    axios
      .post(`${API.TV_MINDER}/login`, {
        email,
        password,
      })
      .then(res => {
        localStorage.setItem('jwt', res.data.token);
        handleFormClose();
        setIsLoggedIn();
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
  const processOtp = (email: string) => {
    axios
      .post(`${API.TV_MINDER}/processotp`, email)
      .then(res => {
        setIsLoading(false);
        setformOption(2);
        toast({
          title: 'Password Reset!',
          description: 'A password reset mail has been sent',
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
  const processOtpVerification = (email: string, otp: string) => {
    axios
      .post(`${API.TV_MINDER}/otpverification`, { email, otp })
      .then(res => {
        setIsLoading(false);
        setformOption(3);
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
        setError('login', 'generic', 'Invalid OTP');
      });
  };
  const processChangePassword = (email: string, password: string) => {
    axios
      .post(`${API.TV_MINDER}/changepassword`, { email, password })
      .then(res => {
        setIsLoading(false);
        setformOption(0);
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
    setformOption(0);
    onClose();
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleFormClose}>
      <ModalOverlay />
      <ModalContent>
        <Box as="form" onSubmit={onSubmit}>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              clearError();
              handleFormClose();
            }}
          />
          <ModalBody pb={6}>
            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                isDisabled={formOption === 0 || formOption === 1 ? false : true}
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
                  <InputRightElement width="4.5rem">
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
                <Input name="otp" placeholder="OTP" ref={register(formSchema.otp)} />
                <FormErrorMessage>{errors.otp?.message}</FormErrorMessage>
              </FormControl>
            )}
            <FormControl isInvalid={Boolean(errors.login)} mt={4}>
              <FormErrorMessage>{errors.login?.message}</FormErrorMessage>
            </FormControl>
            <Link color="teal.500" onClick={() => setformOption((formOption + 1) % 2)}>
              {(formOption === 0 && 'Forgot Password') || (formOption === 1 && '<- Back to Signin')}
            </Link>
          </ModalBody>

          <ModalFooter>
            <Button isLoading={isLoading} mr={3} type="submit" variantColor="cyan">
              {(formOption === 0 && 'Login') ||
                (formOption === 1 && 'Send OTP') ||
                (formOption === 2 && 'Verify') ||
                (formOption === 3 && 'Change Password')}
            </Button>
            <Button onClick={handleFormClose}>Cancel</Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

const mapStateToProps: MapStateToProps<{}, OwnProps, AppState> = () => ({});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedIn: () => dispatch(setIsLoggedInAction()),
  unregisteredClearFollowedShows: () => dispatch(unregisteredClearFollowedShowsAction()),
});

export default connect<{}, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
