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
  const { isMobile } = useResponsiveLayout();
  const isLoading = useAppSelector(selectIsLoadingShowDetails);

  if (isLoading || !videoId) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        variant="surface"
        size="sm"
        borderRadius="full"
        px={isMobile ? 3 : 4}
        transition="all 0.15s ease"
      >
        <Icon as={AiFillYoutube} boxSize="20px" opacity={0.9} />
        <Text fontWeight="600" fontSize="sm" opacity={0.9}>
          Play Trailer
        </Text>
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
      </Dialog.Root>
    </>
  );
};
