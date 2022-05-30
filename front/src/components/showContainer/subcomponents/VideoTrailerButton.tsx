import {
  AspectRatio,
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillYoutube } from 'react-icons/ai';
import YouTube from 'react-youtube';

interface Props {
  isMobile?: boolean;
  videoId: string | undefined;
}

const VideoTrailerButton = ({ isMobile, videoId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const desktopOptions = { height: '390', playerVars: { autoplay: 1 }, width: '640' };
  const mobileOptions = { height: '100%', playerVars: { autoplay: 1 }, width: '100%' };

  return videoId ? (
    <Box alignSelf="center" mb="16px">
      <Button
        borderColor="#bebebe"
        onClick={onOpen}
        size="md"
        variant="outline"
        w={isMobile ? '100%' : 'unset'}
      >
        <Icon as={AiFillYoutube} boxSize="19px" color="red" mr="4px" />
        <Text display="inline" fontSize="14px" fontWeight="500">
          Watch Trailer
        </Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent bg="unset" boxShadow="unset">
          <ModalBody>
            {isMobile ? (
              <AspectRatio ratio={1}>
                <YouTube opts={mobileOptions} videoId={videoId} />
              </AspectRatio>
            ) : (
              <YouTube opts={desktopOptions} videoId={videoId} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  ) : null;
};

export default VideoTrailerButton;
