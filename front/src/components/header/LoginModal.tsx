import React from 'react';
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
import { baseUrl, emailRegex } from 'utils/constants';
import { DisclosureProps } from 'utils/commonTypes';
import handleErrors from 'utils/handleErrors';

interface Props {
  disclosureProps: DisclosureProps;
}

type FormData = {
  email: string;
  password: string;
  login?: string;
};

const inputValidations = {
  email: {
    required: { value: true, message: 'Email is required' },
    pattern: { value: emailRegex, message: 'Please enter a valid email' },
  },
  password: {
    required: 'Password is required',
  },
};

const LoginModal = ({ disclosureProps }: Props) => {
  const { isOpen, onClose } = disclosureProps;
  const { clearError, handleSubmit, errors, register, formState, setError, setValue } = useForm<
    FormData
  >();
  const toast = useToast();

  const onSubmit = handleSubmit(({ email, password }) => {
    axios
      .post(`${baseUrl}/login`, {
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem('jwt', res.data.token);
      })
      .then(() => {
        onClose();
        window.location.reload();
        toast({
          title: 'Login Successful',
          description: 'You are now logged in.',
          status: 'success',
          isClosable: true,
        });
      })
      .catch((err) => {
        handleErrors(err);

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
              <Input name="email" placeholder="Email" ref={register(inputValidations.email)} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={Boolean(errors.password)}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                ref={register(inputValidations.password)}
              />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={Boolean(errors.login)}>
              <FormErrorMessage>{errors.login?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="teal" mr={3} isLoading={formState.isSubmitting} type="submit">
              Login
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
