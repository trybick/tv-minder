import React from 'react';
import { Button, useDisclosure } from '@chakra-ui/core';
import SignUpModal from './SignUpModal';

interface Props {
  closeHeader: () => void;
}

const SignUpButton = ({ closeHeader }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  const handleClick = () => {
    closeHeader();
    onOpen();
  };

  return (
    <>
      <Button onClick={handleClick} variant="solid" bg="#0099DB" color="white">
        Sign Up
      </Button>
      <SignUpModal disclosureProps={disclosureProps} />
    </>
  );
};

export default SignUpButton;
