import {
  Box,
  Flex,
  HoverCard,
  Icon,
  Link,
  Portal,
  Text,
} from '@chakra-ui/react';
import { type EventContentArg } from '@fullcalendar/core';
import { type MouseEvent } from 'react';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { TbBoxMultiple } from 'react-icons/tb';

import { ROUTES } from '~/app/routes';
import { useNavigateWithAnimation } from '~/utils/viewTransition';

type Props = {
  eventInfo: EventContentArg & { backgroundColor: string };
};

export const DesktopCalendarEventPopover = (props: Props) => {
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
  const navigate = useNavigateWithAnimation();

  const handleClickTitle = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`${ROUTES.SHOW}/${showId}`);
  };

  return (
    <HoverCard.Root
      openDelay={500}
      positioning={{ placement: 'right' }}
      size="sm"
    >
      <HoverCard.Trigger asChild>
        <Flex alignItems="center" p="1px 6px">
          {isMulipleEvent && <Icon as={TbBoxMultiple} mr="4px" />}
          <Text fontSize="md" lineClamp={1} as="h3">
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
                color="fg"
                fontSize="14px"
                mb="7px"
                href={`${ROUTES.SHOW}/${showId}`}
                onClick={handleClickTitle}
              >
                <Text lineClamp={1}>{showName}</Text>
              </Link>
              <Text color="fg" fontSize="lg" fontWeight="600" mb="3px">
                {seasonAndEpisodeNumbersFull}
              </Text>
              <Text color="fg" fontSize="sm" fontStyle="italic" mb="8px">
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
                        color="fg"
                      />
                      <Text color="fg" fontSize="13px" fontWeight="500">
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
                        color="fg"
                      />
                      <Text color="fg" fontSize="13px" fontWeight="500">
                        {network}
                      </Text>
                    </Flex>
                  )}
                  {!!runtime && !isMulipleEvent && (
                    <Flex align="center" gap="2px">
                      <Icon
                        alignSelf="center"
                        as={IoIosTimer}
                        boxSize="14px"
                        color="fg"
                      />
                      <Text color="fg" fontSize="13px" fontWeight="500">
                        {runtime} mins
                      </Text>
                    </Flex>
                  )}
                </Flex>
              ) : null}

              {overview && !isMulipleEvent && (
                <Text color="fg" fontSize="sm" mt="9px">
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
