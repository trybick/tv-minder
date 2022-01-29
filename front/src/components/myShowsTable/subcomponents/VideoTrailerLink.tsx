import React from 'react';
import {
  AspectRatio,
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
  isMobile?: boolean;
  videoTrailerKey: string;
}

const VideoTrailerLink = ({ isMobile, videoTrailerKey }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const desktopOptions: Options = { height: '390', playerVars: { autoplay: 1 }, width: '640' };
  const mobileOptions: Options = { height: '100%', playerVars: { autoplay: 1 }, width: '100%' };

  return videoTrailerKey ? (
    <Box>
      <Link onClick={onOpen}>
        <Icon as={AiFillYoutube} boxSize="19px" color="red" mr="2px" verticalAlign="sub" />
        <Text d="inline" fontSize="16px" fontWeight="500">
          Watch Trailer
        </Text>
      </Link>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="unset" boxShadow="unset">
          <ModalBody>
            {isMobile ? (
              <AspectRatio ratio={1}>
                <YouTube opts={mobileOptions} videoId={videoTrailerKey} />
              </AspectRatio>
            ) : (
              <YouTube opts={desktopOptions} videoId={videoTrailerKey} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  ) : null;
};

export default VideoTrailerLink;
