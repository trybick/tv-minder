import React from 'react';
import { Box, Button, useDisclosure } from '@chakra-ui/core';
import LoginModal from './LoginModal';

const LoginButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  return (
    <>
      <Button onClick={onOpen} variant="outline">
        Login
      </Button>
      <LoginModal disclosureProps={disclosureProps} />
    </>
  );
};

export default LoginButton;
