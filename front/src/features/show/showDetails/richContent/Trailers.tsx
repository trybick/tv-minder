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

import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { type ShowTrailer } from '~/store/tv/types/transformed';

import {
  DESKTOP_YOUTUBE_PLAYER_OPTIONS,
  MOBILE_YOUTUBE_PLAYER_OPTIONS,
} from '~/features/show/videoPlayerOptions';

type Props = {
  trailers: ShowTrailer[];
};

export const Trailers = ({ trailers }: Props) => {
  const { isMobile } = useResponsiveLayout();
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
        Trailers
      </Heading>
      <Flex direction="column" gap={1}>
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
            >
              {trailer.name}
            </Text>
            <Text fontSize="xs" color="fg.muted" ml={3}>
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
        size="md"
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
              {selectedTrailer?.key &&
                (isMobile ? (
                  <AspectRatio ratio={1}>
                    <YouTube
                      opts={MOBILE_YOUTUBE_PLAYER_OPTIONS}
                      videoId={selectedTrailer.key}
                    />
                  </AspectRatio>
                ) : (
                  <YouTube
                    opts={DESKTOP_YOUTUBE_PLAYER_OPTIONS}
                    videoId={selectedTrailer.key}
                  />
                ))}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
};
