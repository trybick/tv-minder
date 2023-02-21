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
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillYoutube } from 'react-icons/ai';
import YouTube from 'react-youtube';

type Props = {
  isMobile?: boolean;
  videoId: string | undefined;
};

const VideoTrailerButton = ({ isMobile, videoId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const desktopOptions = { height: '390', playerVars: { autoplay: 1 }, width: '640' };
  const mobileOptions = { height: '100%', playerVars: { autoplay: 1 }, width: '100%' };
  const textColor = useColorModeValue('darkBlack', 'white');

  return videoId ? (
    <Box alignSelf="center" mb={isMobile ? '16px' : ''} mt={isMobile ? '' : '17px'}>
      <Button
        fontSize="16px"
        onClick={onOpen}
        variant={isMobile ? 'outline' : 'link'}
        w={isMobile ? '100%' : 'unset'}
      >
        <Icon as={AiFillYoutube} boxSize="19px" color="red" mr="4px" />
        <Text color={textColor} display="inline" fontSize="15px" fontWeight="600">
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
