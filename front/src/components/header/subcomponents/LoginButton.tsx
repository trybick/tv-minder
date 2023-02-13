import { Button, useDisclosure } from '@chakra-ui/react';
import { PlainFunction } from 'types/common';
import LoginModal from './LoginModal';

type Props = {
  closeHeader: PlainFunction;
};

const LoginButton = ({ closeHeader }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  const handleClick = () => {
    closeHeader();
    onOpen();
  };

  return (
    <>
      <Button borderColor="primary" colorScheme="cyan" onClick={handleClick} variant="outline">
        Login
      </Button>
      <LoginModal disclosureProps={disclosureProps} />
    </>
  );
};

export default LoginButton;
