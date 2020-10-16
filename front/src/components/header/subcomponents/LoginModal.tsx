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
  setIsLoggedIn: (email: string) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
}

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

  // Forgot Password
  const [formOption, setFormOption] = React.useState(0);

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
      .post(`${API.TV_MINDER}/login`, {
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
      .post(`${API.TV_MINDER}/requestonetimecode`, { email })
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
      .post(`${API.TV_MINDER}/verifyonetimecode`, { email, oneTimeCode })
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
      .post(`${API.TV_MINDER}/changepasswordforreset`, { email, password })
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
            {/* The below button is visible in first & second formOption only and toggle between them (i.e. Login, Send One Time Code)
                when formOption = 0 : (0 + 1) % 2 which is 1
                when formOption = 1 : (1 + 1) % 2 which is 0
            */}
            {(formOption === 0 || formOption === 1) && (
              <Link color="teal.500" onClick={() => setFormOption((formOption + 1) % 2)}>
                {(formOption === 0 && 'Forgot Password') ||
                  (formOption === 1 && '<- Back to Signin')}
              </Link>
            )}
          </ModalBody>

          <ModalFooter>
            <Button isLoading={isLoading} mr={3} type="submit" variantColor="cyan">
              {(formOption === 0 && 'Login') ||
                (formOption === 1 && 'Send One Time Code') ||
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
  setIsLoggedIn: (email: string) => dispatch(setIsLoggedInAction(email)),
  unregisteredClearFollowedShows: () => dispatch(unregisteredClearFollowedShowsAction()),
});

export default connect<{}, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
