import { Button, useDisclosure } from '@chakra-ui/react';
import { PlainFunction } from 'types/common';
import LoginModal from './LoginModal';

type Props = {
  closeHeader: PlainFunction;
};

const LoginButton = ({ closeHeader }: Props) => {
  const { open, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen: open, onOpen, onClose };

  const handleClick = () => {
    closeHeader();
    onOpen();
  };

  return (
    <>
      <Button colorPalette="cyan" onClick={handleClick} variant="surface">
        Login
      </Button>
      <LoginModal disclosureProps={disclosureProps} />
    </>
  );
};

export default LoginButton;
