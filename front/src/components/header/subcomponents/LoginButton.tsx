import { Button, useDisclosure } from '@chakra-ui/react';
import LoginModal from './LoginModal';

const LoginButton = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen: open, onOpen, onClose };

  return (
    <>
      <Button colorPalette="cyan" onClick={() => onOpen()} variant="surface">
        Login
      </Button>
      <LoginModal disclosureProps={disclosureProps} />
    </>
  );
};

export default LoginButton;
