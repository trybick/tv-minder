import React from 'react';
import { Box, Button, useDisclosure } from '@chakra-ui/core';
import SignUpModal from './SignUpModal';

const SignUpButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  return (
    <>
      <Button ml=" 12px" onClick={onOpen} variant="outline">
        Create Account
      </Button>
      <SignUpModal disclosureProps={disclosureProps} />
    </>
  );
};

export default SignUpButton;
