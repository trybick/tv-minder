import { useHistory } from 'react-router-dom';
import { EventContentArg } from '@fullcalendar/core';
import {
  Button,
  Collapse,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { TbBoxMultiple } from 'react-icons/tb';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { IoIosTimer } from 'react-icons/io';
import { ROUTES } from 'constants/routes';

type Props = {
  eventInfo: EventContentArg & { backgroundColor: string };
};

const DesktopCalendarEvent = (props: Props) => {
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
  const {
    isOpen: isOverviewDisplayed,
    onToggle: toggleIsOverviewDisplayed,
    onClose: hideOverview,
  } = useDisclosure();
  const history = useHistory();

  return (
    <Popover onClose={hideOverview} placement="right" trigger="hover">
      <PopoverTrigger>
        <Flex alignItems="center" p="1px 6px">
          {isMulipleEvent && <Icon as={TbBoxMultiple} mr="3px" />}
          <Text
            // This className ties into a global style which prevents the truncation from breaking
            className="calendarEventPopoverTrigger"
            fontSize="md"
            noOfLines={1}
          >
            {title}
          </Text>
        </Flex>
      </PopoverTrigger>
      <Portal>
        <PopoverContent bg={backgroundColor} maxWidth="240px" zIndex={4}>
          <PopoverArrow bg={backgroundColor} />
          <PopoverBody p="16px">
            <Button
              color="white"
              fontSize="sm"
              mb="3px"
              onClick={() => history.push(`${ROUTES.SHOW}/${showId}`)}
              variant="link"
            >
              {showName}
            </Button>
            <Text color="white" fontSize="lg" fontWeight="600" mb="2px">
              {seasonAndEpisodeNumbersFull}
            </Text>
            <Text color="white" fontSize="sm" fontStyle="italic" mb="8px">
              {!isMulipleEvent && episodeName}
            </Text>

            {network || runtime || isMulipleEvent ? (
              <Flex flexWrap="wrap" gap="2px 8px">
                {isMulipleEvent && (
                  <Flex align="center" gap="2px">
                    <Icon alignSelf="center" as={TbBoxMultiple} boxSize="14px" />
                    <Text color="white" fontSize="13px" fontWeight="500">
                      {`${multipleEventSpanAmount} episodes`}
                    </Text>
                  </Flex>
                )}
                {network && (
                  <Flex align="center" gap="3px">
                    <Icon alignSelf="center" as={HiOutlineVideoCamera} boxSize="14px" />
                    <Text color="white" fontSize="13px" fontWeight="500">
                      {network}
                    </Text>
                  </Flex>
                )}
                {runtime && !isMulipleEvent && (
                  <Flex align="center" gap="2px">
                    <Icon alignSelf="center" as={IoIosTimer} boxSize="14px" />
                    <Text color="white" fontSize="13px" fontWeight="500">
                      {runtime} mins
                    </Text>
                  </Flex>
                )}
              </Flex>
            ) : null}

            {overview && !isMulipleEvent && (
              <Flex flexDirection="column" mt="9px">
                <Button
                  alignSelf="flex-start"
                  fontWeight="600"
                  onClick={toggleIsOverviewDisplayed}
                  rightIcon={
                    isOverviewDisplayed ? (
                      <ChevronUpIcon boxSize="16px" ml="-8px" />
                    ) : (
                      <ChevronDownIcon boxSize="16px" ml="-8px" />
                    )
                  }
                  size="sm"
                  variant="link"
                >
                  Episode Summary
                </Button>
                <Collapse in={isOverviewDisplayed} animateOpacity>
                  <Text color="white" fontSize="sm" mt="6px">
                    {overview}
                  </Text>
                </Collapse>
              </Flex>
            )}
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default DesktopCalendarEvent;
