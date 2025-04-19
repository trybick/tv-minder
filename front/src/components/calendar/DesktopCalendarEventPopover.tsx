import {
  Box,
  Flex,
  HoverCard,
  Icon,
  Link,
  Portal,
  Text,
} from '@chakra-ui/react';
import { EventContentArg } from '@fullcalendar/core';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { TbBoxMultiple, TbExternalLink } from 'react-icons/tb';
import { useLocation } from 'wouter';
import { ROUTES } from '~/constants/routes';

type Props = {
  eventInfo: EventContentArg & { backgroundColor: string };
};

const DesktopCalendarEventPopover = (props: Props) => {
  const { eventInfo } = props;
  const { backgroundColor } = eventInfo;
  const { title } = eventInfo.event;
  const {
    episodeName,
    isMulipleEvent,
    multipleEventSpanAmount,
    network,
    overview,
    runtime,
    showId,
    showName,
    seasonAndEpisodeNumbersFull,
  } = eventInfo.event.extendedProps;
  const [, navigate] = useLocation();

  return (
    <HoverCard.Root
      openDelay={500}
      positioning={{ placement: 'right' }}
      size="sm"
    >
      <HoverCard.Trigger asChild>
        <Flex alignItems="center" p="1px 6px">
          {isMulipleEvent && <Icon as={TbBoxMultiple} mr="4px" />}
          <Text fontSize="md" lineClamp={1}>
            {title}
          </Text>
        </Flex>
      </HoverCard.Trigger>

      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content
            bg={backgroundColor}
            maxWidth="240px"
            p="16px"
            zIndex={4}
          >
            <HoverCard.Arrow>
              <HoverCard.ArrowTip bg={`${backgroundColor} !important`} />
            </HoverCard.Arrow>
            <Box>
              <Link
                color="white"
                fontSize="14px"
                mb="7px"
                onClick={() => navigate(`${ROUTES.SHOW}/${showId}`)}
              >
                <Text lineClamp={1}>{showName}</Text>
                <TbExternalLink
                  style={{ fontSize: '14px', marginLeft: '-3px' }}
                />
              </Link>
              <Text color="white" fontSize="lg" fontWeight="600" mb="3px">
                {seasonAndEpisodeNumbersFull}
              </Text>
              <Text color="white" fontSize="sm" fontStyle="italic" mb="8px">
                {!isMulipleEvent && episodeName}
              </Text>

              {network || runtime || isMulipleEvent ? (
                <Flex flexWrap="wrap" gap="2px 8px">
                  {isMulipleEvent && (
                    <Flex align="center" gap="2px">
                      <Icon
                        alignSelf="center"
                        as={TbBoxMultiple}
                        boxSize="14px"
                        color="white"
                      />
                      <Text color="white" fontSize="13px" fontWeight="500">
                        {`${multipleEventSpanAmount} episodes`}
                      </Text>
                    </Flex>
                  )}
                  {network && (
                    <Flex align="center" gap="3px">
                      <Icon
                        alignSelf="center"
                        as={HiOutlineVideoCamera}
                        boxSize="14px"
                        color="white"
                      />
                      <Text color="white" fontSize="13px" fontWeight="500">
                        {network}
                      </Text>
                    </Flex>
                  )}
                  {runtime && !isMulipleEvent && (
                    <Flex align="center" gap="2px">
                      <Icon
                        alignSelf="center"
                        as={IoIosTimer}
                        boxSize="14px"
                        color="white"
                      />
                      <Text color="white" fontSize="13px" fontWeight="500">
                        {runtime} mins
                      </Text>
                    </Flex>
                  )}
                </Flex>
              ) : null}

              {overview && !isMulipleEvent && (
                <Text color="white" fontSize="sm" mt="9px">
                  {overview}
                </Text>
              )}
            </Box>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
};

export default DesktopCalendarEventPopover;
