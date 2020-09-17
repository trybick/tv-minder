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
      <Button
        ml=" 12px"
        onClick={handleClick}
        variant="outline"
        borderColor="#0099DB"
        color="#0099DB"
      >
        Login
      </Button>
      <LoginModal disclosureProps={disclosureProps} />
    </>
  );
};

export default LoginButton;
