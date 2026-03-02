import {
  AspectRatio,
  Box,
  Button,
  Dialog,
  EmptyState,
  Flex,
  Heading,
  Icon,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuChevronDown, LuFilm } from 'react-icons/lu';
import YouTube from 'react-youtube';

import { YOUTUBE_PLAYER_OPTIONS } from '~/features/show/VideoTrailerButton';
import { type ShowVideo } from '~/store/tv/types/transformed';

const MAX_VISIBLE_VIDEOS = 3;
const COLLAPSED_CONTENT_GAP = 4;

type Props = {
  videos: ShowVideo[];
};

export const Videos = ({ videos }: Props) => {
  const { open: isOpen, onOpen, onClose } = useDisclosure();
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<ShowVideo | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);

  const openVideo = (video: ShowVideo) => {
    setSelectedVideo(video);
    onOpen();
  };

  const closeVideo = () => {
    onClose();
    setSelectedVideo(null);
  };

  const hasMore = videos.length > MAX_VISIBLE_VIDEOS;

  useEffect(() => {
    const measureHeights = () => {
      const contentElement = contentRef.current;
      if (!contentElement) {
        return;
      }

      const nextContentHeight = contentElement.scrollHeight;
      setContentHeight(nextContentHeight);

      if (!hasMore) {
        setCollapsedHeight(nextContentHeight);
        return;
      }

      const children = Array.from(contentElement.children) as HTMLButtonElement[];
      const collapsedChildren = children.slice(0, MAX_VISIBLE_VIDEOS);
      const nextCollapsedHeight =
        collapsedChildren.reduce((sum, child) => sum + child.offsetHeight, 0) +
        (Math.max(collapsedChildren.length, 1) - 1) * COLLAPSED_CONTENT_GAP;
      setCollapsedHeight(nextCollapsedHeight);
    };

    measureHeights();
    window.addEventListener('resize', measureHeights);
    return () => window.removeEventListener('resize', measureHeights);
  }, [hasMore, videos]);

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
            maxH={
              hasMore && collapsedHeight
                ? `${expanded ? contentHeight : collapsedHeight}px`
                : undefined
            }
            transition={hasMore ? 'max-height 0.24s ease' : undefined}
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

          {hasMore && (
            <Button
              variant="plain"
              size="sm"
              color="fg.muted"
              w="100%"
              mt={2}
              _hover={{ color: 'fg' }}
              onClick={() => setExpanded(prev => !prev)}
            >
              {expanded ? 'Show less' : `Show ${videos.length - MAX_VISIBLE_VIDEOS} more`}
              <Icon
                as={LuChevronDown}
                boxSize="16px"
                ml={1}
                transition="transform 0.2s ease"
                transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}
              />
            </Button>
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
        </Flex>
      )}
    </Box>
  );
};
