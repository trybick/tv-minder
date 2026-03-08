import {
  Box,
  Button,
  Flex,
  HoverCard,
  Icon,
  Image,
  Portal,
  Text,
} from '@chakra-ui/react';
import { type EventContentArg } from '@fullcalendar/core';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { LuExternalLink } from 'react-icons/lu';
import { TbBoxMultiple } from 'react-icons/tb';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';

const POSTER_THUMBNAIL_BASE = 'https://image.tmdb.org/t/p/w154';

type Props = {
  eventInfo: EventContentArg & { backgroundColor: string };
};

export const DesktopCalendarEventPopover = (props: Props) => {
  const { eventInfo } = props;
  const { backgroundColor } = eventInfo;
  const { title } = eventInfo.event;
  const {
    episodeName,
    isMultipleEvent,
    multipleEventSpanAmount,
    network,
    overview,
    posterPath,
    runtime,
    showId,
    showName,
    seasonAndEpisodeNumbersFull,
  } = eventInfo.event.extendedProps;
  const [, navigate] = useLocation();

  const handleGoToShow = () => {
    navigate(`${ROUTES.SHOW}/${showId}`);
  };

  const posterUrl = posterPath
    ? `${POSTER_THUMBNAIL_BASE}${posterPath}`
    : null;

  return (
    <HoverCard.Root
      openDelay={500}
      positioning={{ placement: 'right' }}
      size="sm"
    >
      <HoverCard.Trigger asChild>
        <Flex alignItems="center" p="1px 6px">
          {isMultipleEvent && <Icon as={TbBoxMultiple} mr="4px" />}
          <Text fontSize="md" lineClamp={1} as="h3">
            {title}
          </Text>
        </Flex>
      </HoverCard.Trigger>

      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content
            bg={backgroundColor}
            maxWidth="300px"
            p={4}
            zIndex={4}
          >
            <HoverCard.Arrow>
              <HoverCard.ArrowTip bg={`${backgroundColor} !important`} />
            </HoverCard.Arrow>

            <Flex gap={3}>
              {posterUrl && (
                <Image
                  alt={showName}
                  borderRadius="md"
                  flexShrink={0}
                  h="auto"
                  objectFit="cover"
                  src={posterUrl}
                  w="65px"
                />
              )}

              <Box flex={1} minW={0}>
                <Text
                  color="fg"
                  fontSize="md"
                  fontWeight="700"
                  lineClamp={1}
                >
                  {showName}
                </Text>

                <Text color="fg" fontSize="sm" fontWeight="600" mt="2px">
                  {seasonAndEpisodeNumbersFull}
                </Text>

                {!isMultipleEvent && episodeName && (
                  <Text
                    color="fg"
                    fontSize="xs"
                    fontStyle="italic"
                    lineClamp={1}
                    mt="2px"
                    opacity={0.85}
                  >
                    {episodeName}
                  </Text>
                )}

                {(network || runtime || isMultipleEvent) && (
                  <Flex flexWrap="wrap" gap="2px 8px" mt={2}>
                    {isMultipleEvent && (
                      <Flex align="center" gap="2px">
                        <Icon as={TbBoxMultiple} boxSize="13px" color="fg" />
                        <Text color="fg" fontSize="xs" fontWeight="500">
                          {multipleEventSpanAmount} episodes
                        </Text>
                      </Flex>
                    )}
                    {network && (
                      <Flex align="center" gap="3px">
                        <Icon
                          as={HiOutlineVideoCamera}
                          boxSize="13px"
                          color="fg"
                        />
                        <Text color="fg" fontSize="xs" fontWeight="500">
                          {network}
                        </Text>
                      </Flex>
                    )}
                    {!!runtime && !isMultipleEvent && (
                      <Flex align="center" gap="2px">
                        <Icon as={IoIosTimer} boxSize="13px" color="fg" />
                        <Text color="fg" fontSize="xs" fontWeight="500">
                          {runtime} mins
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                )}
              </Box>
            </Flex>

            {overview && !isMultipleEvent && (
              <Text color="fg" fontSize="xs" lineClamp={3} mt={3} opacity={0.85}>
                {overview}
              </Text>
            )}

            <Button
              borderColor="whiteAlpha.400"
              color="fg"
              mt={3}
              onClick={handleGoToShow}
              size="xs"
              variant="outline"
              w="full"
            >
              <LuExternalLink />
              Go to show
            </Button>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
};
