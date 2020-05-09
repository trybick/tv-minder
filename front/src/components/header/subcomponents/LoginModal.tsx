import React from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/core';
import { setIsLoggedInAction, unregisteredClearFollowedShowsAction } from 'store/user/actions';
import { baseUrl, emailRegex } from 'utils/constants';
import { DisclosureProps } from 'utils/commonTypes';
import handleErrors from 'utils/handleErrors';

interface OwnProps {
  disclosureProps: DisclosureProps;
}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedInAction;
  unregisteredClearFollowedShows: typeof unregisteredClearFollowedShowsAction;
}

type Props = DispatchProps & OwnProps;

type FormData = {
  email: string;
  password: string;
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
};

const LoginModal = ({ disclosureProps, setIsLoggedIn, unregisteredClearFollowedShows }: Props) => {
  // Modal
  const [isLoading, setIsLoading] = React.useState(false);
  const { isOpen, onClose } = disclosureProps;
  const toast = useToast();

  // Form
  const { clearError, handleSubmit, errors, register, setError, setValue } = useForm<FormData>();

  const onSubmit = handleSubmit(({ email, password }) => {
    setIsLoading(true);
    axios
      .post(`${baseUrl}/login`, {
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem('jwt', res.data.token);
        setIsLoggedIn();
        unregisteredClearFollowedShows();
        onClose();

        toast({
          title: 'Login Successful',
          description: 'You are now logged in.',
          status: 'success',
          isClosable: true,
        });
      })
      .catch((err) => {
        handleErrors(err);
        setIsLoading(false);
        setError('login', 'generic', 'Invalid login. Please try again.');
        setValue('password', '');
      });
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <Box as="form" onSubmit={onSubmit}>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              clearError();
              onClose();
            }}
          />

          <ModalBody pb={6}>
            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input name="email" placeholder="Email" ref={register(formSchema.email)} autoFocus />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={Boolean(errors.password)}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                ref={register(formSchema.password)}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={Boolean(errors.login)}>
              <FormErrorMessage>{errors.login?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="teal" mr={3} isLoading={isLoading} type="submit">
              Login
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  setIsLoggedIn: () => dispatch(setIsLoggedInAction()),
  unregisteredClearFollowedShows: () => dispatch(unregisteredClearFollowedShowsAction()),
});

export default connect(null, mapDispatchToProps)(LoginModal);
