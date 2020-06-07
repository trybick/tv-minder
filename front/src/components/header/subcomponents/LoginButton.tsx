import React from 'react';
import { Button, useDisclosure } from '@chakra-ui/core';
import LoginModal from './LoginModal';

interface Props {
  closeHeader: () => void;
}

const LoginButton = ({ closeHeader }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  const handleClick = () => {
    closeHeader();
    onOpen();
  };

  return (
    <>
      <Button onClick={handleClick} variant="outline">
        Login
      </Button>
      <LoginModal disclosureProps={disclosureProps} />
    </>
  );
};

export default LoginButton;
