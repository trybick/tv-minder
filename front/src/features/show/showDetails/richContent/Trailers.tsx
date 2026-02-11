import {
  AspectRatio,
  Box,
  Button,
  Dialog,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import YouTube from 'react-youtube';

import { YOUTUBE_PLAYER_OPTIONS } from '~/features/show/videoPlayerOptions';
import { type ShowTrailer } from '~/store/tv/types/transformed';

const MAX_VISIBLE_TRAILERS = 4;
const TRAILER_ROW_HEIGHT = 40;

type Props = {
  trailers: ShowTrailer[];
};

export const Trailers = ({ trailers }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTrailer, setSelectedTrailer] = useState<ShowTrailer | null>(
    null
  );

  const openTrailer = (trailer: ShowTrailer) => {
    setSelectedTrailer(trailer);
    onOpen();
  };

  const closeTrailer = () => {
    onClose();
    setSelectedTrailer(null);
  };

  return (
    <Box
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="xl"
      bg="whiteAlpha.50"
      p={4}
    >
      <Heading
        as="h3"
        fontSize={{ base: 'md', md: 'lg' }}
        fontWeight="700"
        letterSpacing="-0.01em"
        mb={3}
      >
        Videos
      </Heading>
      <Flex
        direction="column"
        gap={1}
        maxH={`${MAX_VISIBLE_TRAILERS * TRAILER_ROW_HEIGHT}px`}
        overflowY="auto"
      >
        {trailers.map(trailer => (
          <Button
            key={trailer.key}
            variant="ghost"
            justifyContent="space-between"
            h="auto"
            py={2}
            px={2.5}
            onClick={() => openTrailer(trailer)}
            _hover={{ bg: 'whiteAlpha.100' }}
          >
            <Text
              color="cyan.300"
              fontWeight="500"
              fontSize="sm"
              textAlign="left"
              flex="1"
              truncate
            >
              {trailer.name}
            </Text>
            <Text fontSize="xs" color="fg.muted" ml={3} flexShrink={0}>
              {trailer.type}
            </Text>
          </Button>
        ))}
      </Flex>

      <Dialog.Root
        open={isOpen}
        onOpenChange={details => {
          if (!details.open) {
            closeTrailer();
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
              <Dialog.Title fontSize="md">
                {selectedTrailer?.name ?? 'Trailer'}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb={4}>
              {selectedTrailer?.key && (
                <AspectRatio ratio={16 / 9}>
                  <YouTube
                    opts={YOUTUBE_PLAYER_OPTIONS}
                    videoId={selectedTrailer.key}
                  />
                </AspectRatio>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};
