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
        variant="surface"
        size="sm"
        colorPalette="gray"
        borderRadius="full"
        px={4}
      >
        <Icon as={AiFillYoutube} boxSize="18px" color="red.500" />
        <Text fontWeight="600" fontSize="xs">
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
