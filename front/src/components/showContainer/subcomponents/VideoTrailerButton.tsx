import {
  AspectRatio,
  Box,
  Button,
  Dialog,
  Icon,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillYoutube } from 'react-icons/ai';
import YouTube from 'react-youtube';

import { useIsMobile } from '~/hooks/useIsMobile';

type Props = {
  videoId: string | undefined;
  isLoading: boolean;
};

const VideoTrailerButton = ({ videoId, isLoading }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useIsMobile();

  const desktopOptions = {
    height: '390',
    playerVars: { autoplay: 1 },
    width: '640',
  };
  const mobileOptions = {
    height: '100%',
    playerVars: { autoplay: 1 },
    width: '100%',
  };

  return isLoading || (!isLoading && videoId) ? (
    <Box
      alignSelf="center"
      mb={isMobile ? '20px' : '9px'}
      mt={isMobile ? '' : '20px'}
    >
      <Skeleton loading={isLoading} w="145px">
        <Button
          fontSize="16px"
          onClick={onOpen}
          variant={isMobile ? 'outline' : 'surface'}
          w={isMobile ? '100%' : 'unset'}
        >
          <Icon as={AiFillYoutube} boxSize="19px" color="red" mr="4px" />
          <Text display="inline" fontSize="15px" fontWeight="600">
            Play Trailer
          </Text>
        </Button>
      </Skeleton>

      <Dialog.Root
        onOpenChange={onClose}
        open={isOpen}
        placement="center"
        size="md"
        lazyMount
      >
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
