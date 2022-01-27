import React from 'react';
import {
  Box,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillYoutube } from 'react-icons/ai';
import YouTube, { Options } from 'react-youtube';

interface Props {
  videoTrailerKey: string;
}

const VideoTrailerLink = ({ videoTrailerKey }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const youtubeOptions: Options = { height: '390', playerVars: { autoplay: 1 }, width: '640' };

  return videoTrailerKey ? (
    <Box mb="10px">
      <Link onClick={onOpen}>
        <Icon as={AiFillYoutube} boxSize="22px" color="red" mr="3px" verticalAlign="sub" />
        <Text d="inline" fontSize="16px" fontWeight="500">
          Watch Trailer
        </Text>
      </Link>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="unset" boxShadow="unset">
          <ModalBody>
            <YouTube opts={youtubeOptions} videoId={videoTrailerKey} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  ) : null;
};

export default VideoTrailerLink;
