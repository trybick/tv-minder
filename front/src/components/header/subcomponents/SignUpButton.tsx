import React from 'react';
import { Button, useDisclosure } from '@chakra-ui/core';
import SignUpModal from './SignUpModal';

const SignUpButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  return (
    <>
      <Button ml=" 12px" onClick={onOpen} variant="outline">
        Sign Up
      </Button>
      <SignUpModal disclosureProps={disclosureProps} />
    </>
  );
};

export default SignUpButton;