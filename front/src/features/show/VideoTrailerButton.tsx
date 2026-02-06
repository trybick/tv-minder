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

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';

type Props = {
  videoId: string | undefined;
};

export const VideoTrailerButton = ({ videoId }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const { isMobile } = useResponsiveLayout();
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

  if (isLoading || !videoId) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="solid"
        size={isMobile ? 'sm' : 'sm'}
        borderRadius="full"
        px={4}
        boxShadow="md"
        _hover={{ boxShadow: 'lg', transform: 'translateY(-1px)' }}
        _active={{ transform: 'translateY(0px)' }}
        transition="all 0.15s ease"
      >
        <Icon as={AiFillYoutube} boxSize="20px" />
        <Text fontWeight="700" fontSize="sm">
          Play Trailer
        </Text>
      </Button>

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
