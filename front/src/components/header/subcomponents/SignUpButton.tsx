import { Button, useDisclosure } from '@chakra-ui/react';

import SignUpModal from './SignUpModal';

const SignUpButton = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen: open, onOpen, onClose };

  return (
    <>
      <Button colorPalette="cyan" onClick={() => onOpen()} variant="solid">
        Sign Up
      </Button>
      <SignUpModal disclosureProps={disclosureProps} />
    </>
  );
};

export default SignUpButton;
