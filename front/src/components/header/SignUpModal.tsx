import React from 'react';
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
  const { handleSubmit, errors, register, formState } = useForm();

  function onSubmit(values: any) {
    console.log('values:', values);
  }

  function validateEmail(email: any) {
    let error;
    const isCorrectFormat = emailRegex.test(String(email).toLowerCase());

    if (!email) {
      error = 'Email is required';
    } else if (!isCorrectFormat) {
      error = 'Please enter a valid email address';
    }

    return error || true;
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
                <Input
                  name="email"
                  placeholder="Email"
                  ref={register({ validate: validateEmail })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input placeholder="Password" />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input placeholder="Confirm Password" />
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
