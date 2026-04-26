import {
  AspectRatio,
  Button,
  Dialog,
  Icon,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { lazy } from 'react';
import { AiFillYoutube } from 'react-icons/ai';

const YouTube = lazy(() => import('react-youtube'));

import { useAppSelector } from '~/store';
import { selectIsLoadingShowDetails } from '~/store/tv/selectors';

export const YOUTUBE_PLAYER_OPTIONS = {
  height: '100%',
  playerVars: { autoplay: 1 },
  width: '100%',
};

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
                  <YouTube opts={YOUTUBE_PLAYER_OPTIONS} videoId={videoId} />
                </AspectRatio>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
