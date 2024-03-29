import { Button, useDisclosure } from '@chakra-ui/react';
import { PlainFunction } from 'types/common';
import SignUpModal from './SignUpModal';

type Props = {
  closeHeader: PlainFunction;
};

const SignUpButton = ({ closeHeader }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const disclosureProps = { isOpen, onOpen, onClose };

  const handleClick = () => {
    closeHeader();
    onOpen();
  };

  return (
    <>
      <Button bg="primary" color="white" ml="12px" onClick={handleClick} variant="solid">
        Sign Up
      </Button>
      <SignUpModal disclosureProps={disclosureProps} />
    </>
  );
};

export default SignUpButton;
