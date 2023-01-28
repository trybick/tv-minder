import { MutableRefObject, useRef, useState } from 'react';
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
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { setIsLoggedInAction, unregisteredClearFollowedShowsAction } from 'store/user/actions';
import { selectUnregisteredFollowedShows } from 'store/user/selectors';
import { DisclosureProps, ID } from 'types/common';
import { API } from 'constants/api';
import { emailRegex } from 'constants/strings';
import handleErrors from 'utils/handleErrors';
import GoogleLoginButton from './GoogleLoginButton';

type OwnProps = {
  disclosureProps: DisclosureProps;
};

type StateProps = {
  unregisteredFollowedShows: ID[];
};

type DispatchProps = {
  setIsLoggedIn: (email: string) => void;
  unregisteredClearFollowedShows: AppThunkPlainAction;
};

type Props = DispatchProps & StateProps & OwnProps;

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  signUp?: string;
};

const SignUpModal = ({
  disclosureProps,
  setIsLoggedIn,
  unregisteredClearFollowedShows,
  unregisteredFollowedShows,
}: Props) => {
  // Modal
  const { isOpen, onClose } = disclosureProps;
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Form
  const { clearError, errors, handleSubmit, reset, setError, register, watch } =
    useForm<FormData>();
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const watchedPassword = useRef({});
  watchedPassword.current = watch('password', '');

  // Password fields
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);

  const formSchema = {
    email: {
      required: { value: true, message: 'Email is required' },
      pattern: { value: emailRegex, message: 'Please enter a valid email' },
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 1,
        message: 'Password must have at least 1 characters',
      },
    },
    confirmPassword: {
      validate: (value: FormData['confirmPassword']) =>
        value === watchedPassword.current || 'The passwords do not match',
    },
  };

  const onSubmit = handleSubmit(({ email, password }) => {
    setIsLoading(true);
    axios
      .post(`${API.TV_MINDER}/register`, {
        email,
        password,
        unregisteredFollowedShows,
      })
      .then(() => {
        return axios.post(`${API.TV_MINDER}/login`, {
          email,
          password,
        });
      })
      .then(res => {
        localStorage.setItem('jwt', res.data.token);
        onClose();
        setIsLoggedIn(res.data.email);
        unregisteredClearFollowedShows();

        toast({
          title: 'Logged in',
          description: "We've created your account for you.",
          status: 'success',
          isClosable: true,
        });
      })
      .catch(err => {
        handleErrors(err);
        setIsLoading(false);
        reset({}, { errors: true });
        emailRef.current?.focus();

        if (err.response?.status === 409) {
          setError('signUp', 'emailTaken', 'Email already registered. Please try again.');
        } else {
          setError('signUp', 'generic', 'Could not sign up. Please try again.');
        }
      });
  });

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={useColorModeValue('#fff', '#2D3748')} mx="20px">
        <ModalHeader>Create your account</ModalHeader>
        <ModalCloseButton
          onClick={() => {
            clearError();
            onClose();
          }}
        />

        <GoogleLoginButton
          onClose={onClose}
          setIsLoggedIn={setIsLoggedIn}
          unregisteredClearFollowedShows={unregisteredClearFollowedShows}
        />

        <Box as="form" onSubmit={onSubmit}>
          <ModalBody pb={6}>
            <Separator alignItems="center" fontSize="14px" m="26px 0" textAlign="center">
              OR
            </Separator>

            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                name="email"
                placeholder="Email"
                ref={(emailInput: HTMLInputElement) => {
                  register(emailInput, formSchema.email);
                  emailRef.current = emailInput;
                }}
                autoFocus
              />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.password)} mt={4}>
              <FormLabel>Password</FormLabel>
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

            <FormControl isInvalid={Boolean(errors.confirmPassword)} mt={4}>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  ref={register(formSchema.confirmPassword)}
                  type={passwordVisible ? 'text' : 'password'}
                />
                <InputRightElement w="4.5rem">
                  <Button h="1.75rem" onClick={togglePasswordVisible} size="sm" tabIndex={-1}>
                    {passwordVisible ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={Boolean(errors.signUp)} mt={4}>
              <FormErrorMessage>{errors.signUp?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button bg="primary" color="white" isLoading={isLoading} mr={3} type="submit">
              Sign Up
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (state: AppState) => ({
  unregisteredFollowedShows: selectUnregisteredFollowedShows(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  setIsLoggedIn: (email: string) => dispatch(setIsLoggedInAction(email)),
  unregisteredClearFollowedShows: () => dispatch(unregisteredClearFollowedShowsAction()),
});

export default connect<StateProps, DispatchProps, OwnProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SignUpModal);
