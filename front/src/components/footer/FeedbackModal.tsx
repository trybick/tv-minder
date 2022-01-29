import { ChangeEvent, useRef, useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import { API } from 'constants/api';
import handleErrors from 'utils/handleErrors';
import { DisclosureProps } from 'types/common';

interface Props {
  disclosureProps: DisclosureProps;
}

const FeedbackModal = ({ disclosureProps }: Props) => {
  const { isOpen, onClose } = disclosureProps;
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const initialRef = useRef(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await axios
      .post(`${API.TV_MINDER}/contact`, {
        text: value,
      })
      .then(() => {
        setIsSubmitting(false);
        setValue('');
        onClose();
        toast({
          title: 'Feedback submitted',
          description: 'Thanks for your message!',
          status: 'success',
          isClosable: true,
        });
      })
      .catch(error => {
        handleErrors(error);
        setError(error.message);
        setIsSubmitting(false);
      });
  };

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Submit Feedback</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Textarea
            h="150px"
            mb={2}
            onChange={handleTextChange}
            placeholder="Any feedback welcome 😎"
            ref={initialRef}
            value={value}
          />
          {error && (
            <Text color="#ff3e3e" fontSize="sm">
              {error}
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            bg="primary"
            color="white"
            isDisabled={!value}
            isLoading={isSubmitting}
            mr={3}
            onClick={handleSubmit}
            rightIcon={<FiSend />}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeedbackModal;
