import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
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
} from '@chakra-ui/core';
import { emailRegex } from 'utils/constants';

interface Props {
  disclosureProps: any;
}

const SignUpModal = ({ disclosureProps }: Props) => {
  const { isOpen, onClose } = disclosureProps;
  const { handleSubmit, errors, register, formState, watch } = useForm();
  const watchedPassword = useRef({});
  watchedPassword.current = watch('password', '');

  const inputValidations = {
    email: {
      required: { value: true, message: 'Email is required' },
      pattern: { value: emailRegex, message: 'Please enter a valid email' },
    },
    password: {
      required: 'Password is required',
      minLength: {
        value: 6,
        message: 'Password must have at least 6 characters',
      },
    },
    confirmPassword: {
      validate: (value: any) => value === watchedPassword.current || 'The passwords do not match',
    },
  };

  function onSubmit(values: any) {
    console.log('values:', values);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Create your account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl isInvalid={errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input name="email" placeholder="Email" ref={register(inputValidations.email)} />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  ref={register(inputValidations.password)}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  ref={register(inputValidations.confirmPassword)}
                />
                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variantColor="teal" mr={3} isLoading={formState.isSubmitting} type="submit">
                Sign Up
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignUpModal;
