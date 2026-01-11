import {
  AspectRatio,
  Button,
  Dialog,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillYoutube } from 'react-icons/ai';
import YouTube from 'react-youtube';

import DelayedSkeleton from '~/components/DelayedSkeleton';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';

type Props = {
  videoId: string | undefined;
};

const VideoTrailerButton = ({ videoId }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useIsMobile();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

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

  if (!isLoading && !videoId) {
    return null;
  }

  return (
    <>
      <DelayedSkeleton
        isLoading={isLoading}
        w={isMobile ? '100%' : '145px'}
        h="40px"
      >
        <Button
          onClick={onOpen}
          variant="surface"
          size={isMobile ? 'lg' : 'md'}
          bg="whiteAlpha.100"
          _hover={{ bg: 'whiteAlpha.200' }}
          borderRadius="lg"
          w={isMobile ? '100%' : 'auto'}
        >
          <Icon
            as={AiFillYoutube}
            boxSize="22px"
            color="red.500"
            opacity={0.7}
          />
          <Text fontWeight="600" fontSize="sm">
            Play Trailer
          </Text>
        </Button>
      </DelayedSkeleton>

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
    </>
  );
};

export default VideoTrailerButton;
