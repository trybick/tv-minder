import { useHistory } from 'react-router-dom';
import {
  Button,
  Collapse,
  Flex,
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
import { ROUTES } from 'constants/routes';

type Props = {
  backgroundColor: string;
  episodeName: string;
  network: string;
  overview: string;
  runtime: number;
  seasonAndEpisodeNumers: string;
  showName: string;
  showId: number;
  title: string;
};

const CalendarEventPopover = (props: Props) => {
  const {
    backgroundColor,
    episodeName,
    network,
    overview,
    runtime,
    seasonAndEpisodeNumers,
    showId,
    showName,
    title,
  } = props;
  const {
    isOpen: isOverviewDisplayed,
    onToggle: toggleIsOverviewDisplayed,
    onClose: hideOverview,
  } = useDisclosure();
  const history = useHistory();

  return (
    <Popover onClose={hideOverview} placement="right" trigger="hover">
      <PopoverTrigger>
        <Text
          className="calendarEventPopoverTrigger"
          fontSize="md"
          noOfLines={1}
          p="4px 6px"
          textAlign="center"
        >
          {title}
        </Text>
      </PopoverTrigger>
      <Portal>
        <PopoverContent bg={backgroundColor} maxWidth="240px" zIndex={4}>
          <PopoverArrow bg={backgroundColor} />
          <PopoverBody p="16px">
            <Button
              color="white"
              fontSize="lg"
              fontWeight="600"
              mb="2px"
              onClick={() => history.push(`${ROUTES.SHOW}/${showId}`)}
              textAlign="left"
              userSelect="auto"
              variant="link"
              whiteSpace="normal"
            >
              {showName}
            </Button>
            <Text color="white" fontSize="md" mb="4px">
              {seasonAndEpisodeNumers}: {episodeName}
            </Text>
            {(network || runtime) && (
              <Text color="white" fontSize="sm" fontWeight="500">
                {network && runtime ? `${network} | ${runtime} mins` : network || `${runtime} mins`}
              </Text>
            )}
            {overview && (
              <Flex flexDirection="column" mt="6px">
                <Button
                  alignSelf="flex-start"
                  fontWeight="700"
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
                  Summary
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

export default CalendarEventPopover;
