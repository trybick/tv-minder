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

  const password = useRef({});
  password.current = watch('password', '');

  function onSubmit(values: any) {
    console.log('values:', values);
  }
  const emailValidation = {
    required: { value: true, message: 'Email is required' },
    pattern: { value: emailRegex, message: 'Please enter a valid email' },
  };

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
                <Input name="email" placeholder="Email" ref={register(emailValidation)} />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  ref={register({
                    required: 'Please specify a password',
                    minLength: {
                      value: 6,
                      message: 'Password must have at least 6 characters',
                    },
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={errors.passwordRepeat}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  name="passwordRepeat"
                  type="password"
                  placeholder="Confirm Password"
                  ref={register({
                    validate: (value) => value === password.current || 'The passwords do not match',
                  })}
                />
                <FormErrorMessage>{errors.passwordRepeat?.message}</FormErrorMessage>
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
