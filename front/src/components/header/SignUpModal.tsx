import React, { useRef } from 'react';
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

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  signUp?: string;
};

const SignUpModal = ({ disclosureProps }: { disclosureProps: DisclosureProps }) => {
  // Modal
  const { isOpen, onClose } = disclosureProps;
  const [isLoading, setIsLoading] = React.useState(false);
  const toast = useToast();

  // Form
  const { clearError, errors, handleSubmit, reset, setError, register, watch } = useForm<
    FormData
  >();
  const emailRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const watchedPassword = useRef({});
  watchedPassword.current = watch('password', '');

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
      .post(`${baseUrl}/register`, {
        email,
        password,
      })
      .then(() => {
        return axios.post(`${baseUrl}/login`, {
          email,
          password,
        });
      })
      .then((res) => {
        localStorage.setItem('jwt', res.data.token);
        window.location.reload();
      })
      .then(() => {
        onClose();
        toast({
          title: 'Logged in',
          description: "We've created your account for you.",
          status: 'success',
          isClosable: true,
        });
      })
      .catch((err) => {
        handleErrors(err);
        setIsLoading(false);
        reset({}, { errors: true });
        emailRef.current?.focus();

        if (err.response.status === 409) {
          setError('signUp', 'emailTaken', 'Email already registered. Please try again.');
        } else {
          setError('signUp', 'generic', 'Could not sign up. Please try again.');
        }
      });
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} initialFocusRef={emailRef}>
      <ModalOverlay />
      <ModalContent>
        <Box as="form" onSubmit={onSubmit}>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              clearError();
              onClose();
            }}
          />
          <ModalBody pb={6}>
            <FormControl isInvalid={Boolean(errors.email)}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                name="email"
                placeholder="Email"
                ref={(emailInput: HTMLInputElement) => {
                  register(emailInput, formSchema.email);
                  emailRef.current = emailInput;
                }}
              />
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

            <FormControl mt={4} isInvalid={Boolean(errors.confirmPassword)}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                ref={register(formSchema.confirmPassword)}
              />
              <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={Boolean(errors.signUp)}>
              <FormErrorMessage>{errors.signUp?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="teal" mr={3} type="submit" isLoading={isLoading}>
              Sign Up
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
