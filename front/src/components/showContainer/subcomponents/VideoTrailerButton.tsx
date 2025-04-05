import { AspectRatio, Box, Button, Dialog, Icon, Text, useDisclosure } from '@chakra-ui/react';
import { AiFillYoutube } from 'react-icons/ai';
import YouTube from 'react-youtube';
import { useColorModeValue } from 'components/ui/color-mode';

type Props = {
  isMobile?: boolean;
  videoId: string | undefined;
};

const VideoTrailerButton = ({ isMobile, videoId }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const desktopOptions = { height: '390', playerVars: { autoplay: 1 }, width: '640' };
  const mobileOptions = { height: '100%', playerVars: { autoplay: 1 }, width: '100%' };
  const textColor = useColorModeValue('darkBlack', 'white');

  return videoId ? (
    <Box alignSelf="center" mb={isMobile ? '20px' : '9px'} mt={isMobile ? '' : '20px'}>
      <Button
        fontSize="16px"
        onClick={onOpen}
        // chakra todo: desktop one used to be link
        variant={isMobile ? 'outline' : 'outline'}
        w={isMobile ? '100%' : 'unset'}
      >
        <Icon as={AiFillYoutube} boxSize="19px" color="red" mr="4px" />
        <Text color={textColor} display="inline" fontSize="15px" fontWeight="600">
          Play Trailer
        </Text>
      </Button>

      <Dialog.Root onOpenChange={onClose} open={isOpen} placement="center" size="xl">
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Backdrop />
          <Dialog.Content>
            {isMobile ? (
              <AspectRatio ratio={1}>
                <YouTube opts={mobileOptions} videoId={videoId} />
              </AspectRatio>
            ) : (
              <YouTube opts={desktopOptions} videoId={videoId} />
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  ) : null;
};

export default VideoTrailerButton;
