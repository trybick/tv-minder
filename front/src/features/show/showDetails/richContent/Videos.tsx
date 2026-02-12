import {
  AspectRatio,
  Box,
  Button,
  Dialog,
  EmptyState,
  Flex,
  Heading,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuFilm } from 'react-icons/lu';
import YouTube from 'react-youtube';

import { YOUTUBE_PLAYER_OPTIONS } from '~/features/show/VideoTrailerButton';
import { type ShowVideo } from '~/store/tv/types/transformed';

const MAX_VISIBLE_VIDEOS = 4;
const VIDEO_ROW_HEIGHT = 40;

type Props = {
  videos: ShowVideo[];
};

export const Videos = ({ videos }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<ShowVideo | null>(null);

  const openVideo = (video: ShowVideo) => {
    setSelectedVideo(video);
    onOpen();
  };

  const closeVideo = () => {
    onClose();
    setSelectedVideo(null);
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

      {!videos.length ? (
        <EmptyState.Root size="sm">
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuFilm />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>No videos available</EmptyState.Title>
              <EmptyState.Description>
                No trailers or clips have been added for this show yet.
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      ) : (
        <>
          <Flex
            direction="column"
            gap={1}
            maxH={`${MAX_VISIBLE_VIDEOS * VIDEO_ROW_HEIGHT}px`}
            overflowY="auto"
          >
            {videos.map(video => (
              <Button
                key={video.key}
                variant="ghost"
                justifyContent="space-between"
                h="auto"
                py={2}
                px={2.5}
                onClick={() => openVideo(video)}
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
                  {video.name}
                </Text>
                <Text fontSize="xs" color="fg.muted" ml={3} flexShrink={0}>
                  {video.type}
                </Text>
              </Button>
            ))}
          </Flex>

          <Dialog.Root
            open={isOpen}
            onOpenChange={details => {
              if (!details.open) {
                closeVideo();
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
                    {selectedVideo?.name ?? 'Video'}
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body pb={4}>
                  {selectedVideo?.key && (
                    <AspectRatio ratio={16 / 9}>
                      <YouTube
                        opts={YOUTUBE_PLAYER_OPTIONS}
                        videoId={selectedVideo.key}
                      />
                    </AspectRatio>
                  )}
                </Dialog.Body>
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        </>
      )}
    </Box>
  );
};
