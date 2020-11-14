import React from 'react';
import { Button, useDisclosure } from '@chakra-ui/react';
import { PlainFunction } from 'types/common';
import LoginModal from './LoginModal';

interface Props {
  closeHeader: PlainFunction;
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
        borderColor="primary"
        color="primary"
        ml=" 12px"
        onClick={handleClick}
        variant="outline"
      >
        Login
      </Button>
      <LoginModal disclosureProps={disclosureProps} />
    </>
  );
};

export default LoginButton;
