import {
  AspectRatio,
  Box,
  Button,
  Dialog,
  EmptyState,
  Flex,
  Heading,
  Portal,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuFilm } from 'react-icons/lu';

import { ExpandCollapseButton } from '~/components/ExpandCollapseButton';
import { YouTubePlayer } from '~/components/YouTubePlayer';
import { useCollapsibleSection } from '~/hooks/useCollapsibleSection';
import { type ShowVideo } from '~/store/tv/types/transformed';

const MAX_VISIBLE_VIDEOS = 3;
const COLLAPSED_CONTENT_GAP = 4;

const measureCollapsedVideoHeight = (contentElement: HTMLElement) => {
  const collapsedChildren = Array.from(contentElement.children).slice(
    0,
    MAX_VISIBLE_VIDEOS
  ) as HTMLButtonElement[];
  const childHeights = collapsedChildren.map(child => child.offsetHeight);

  return (
    childHeights.reduce((sum, height) => sum + height, 0) +
    (Math.max(collapsedChildren.length, 1) - 1) * COLLAPSED_CONTENT_GAP
  );
};

type Props = {
  videos: ShowVideo[];
};

export const Videos = ({ videos }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<ShowVideo | null>(null);
  const hasMore = videos.length > MAX_VISIBLE_VIDEOS;
  const {
    contentRef,
    expanded,
    toggleExpanded,
    isCollapsible,
    maxHeight,
    transition,
  } = useCollapsibleSection({
    collapsedHeight: measureCollapsedVideoHeight,
    isActive: hasMore,
    showToggle: hasMore,
    deps: [hasMore, videos],
  });

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
      display="flex"
      flexDirection="column"
      w="100%"
      h="100%"
      minH={{ md: '240px' }}
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
        <EmptyState.Root size="sm" flex="1">
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
        <Flex direction="column" flex="1">
          <Flex
            ref={contentRef}
            direction="column"
            gap={1}
            overflow="hidden"
            maxH={maxHeight}
            transition={transition}
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

          {isCollapsible && (
            <ExpandCollapseButton
              expanded={expanded}
              onToggle={toggleExpanded}
              collapsedLabel={`Show ${videos.length - MAX_VISIBLE_VIDEOS} more`}
            />
          )}

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
            <Portal>
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
                        <YouTubePlayer videoId={selectedVideo.key} />
                      </AspectRatio>
                    )}
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Flex>
      )}
    </Box>
  );
};
