import {
  AspectRatio,
  Button,
  Dialog,
  Icon,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { AiFillYoutube } from 'react-icons/ai';

import { YouTubePlayer } from '~/components/YouTubePlayer';
import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';

type Props = {
  videoId: string | undefined;
};

export const VideoTrailerButton = ({ videoId }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  if (isLoading || !videoId) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="outline"
        colorPalette="gray"
        size="lg"
        borderRadius="md"
        w="100%"
        transition="all 0.15s ease"
        borderColor="whiteAlpha.300"
        _hover={{ bg: 'whiteAlpha.100', borderColor: 'whiteAlpha.400' }}
      >
        <Icon as={AiFillYoutube} boxSize="20px" color="red.400" />
        Play Trailer
      </Button>

      <Dialog.Root
        open={isOpen}
        onOpenChange={details => {
          if (!details.open) {
            onClose();
          }
        }}
        placement="center"
        size="xl"
        lazyMount
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content overflow="hidden">
              <Dialog.Header>
                <Dialog.Title fontSize="md">Official Trailer</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb={4}>
                <AspectRatio ratio={16 / 9}>
                  <YouTubePlayer videoId={videoId} />
                </AspectRatio>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
